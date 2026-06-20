import mongoose from 'mongoose'
import { getSignedCertificateView } from '../config/cloudinary.js'
import {
  sendVerificationApprovedEmail,
  sendVerificationRejectedEmail,
} from '../notifications/index.js'
import {
  NGO_SECTOR,
  NOTIFICATION_TYPE,
  ROLES,
  VERIFICATION_STATUS,
  type Role,
  type VerificationStatus,
} from '../constants/enums.js'
import {
  VERIFICATION_REJECT_REASON_LABELS,
  type VerificationRejectReasonCode,
} from '../constants/verification-reject-reasons.js'
import { User, Admin } from '../models/user.js'
import { resolveNgoCapacityFromSource } from '../utils/resolve-ngo-capacity.js'
import {
  conflict,
  notFound,
} from '../utils/app-error.js'
import {
  resolveDocumentSigningMetadata,
  type StoredVerificationDocumentLike,
} from '../utils/verification-document.js'
import { normalizePhone } from '../utils/phone.js'
import {
  emitVerificationNew,
  emitVerificationUpdated,
} from '../realtime/verification-events.js'
import { notifyAdminsOfNewVerification } from './admin-notification-service.js'
import { createInAppNotificationForUser } from './admin-verification-notifications.js'
import type {
  AdminVerificationsQuery,
  RejectVerificationInput,
} from '../validators/admin-verification.js'

const PENDING_FILTER = {
  role: { $in: [ROLES.DONOR, ROLES.NGO] },
  'verification.status': VERIFICATION_STATUS.PENDING,
} as const

const ALL_VERIFICATIONS_FILTER = {
  role: { $in: [ROLES.DONOR, ROLES.NGO] },
  'verification.status': {
    $in: [
      VERIFICATION_STATUS.PENDING,
      VERIFICATION_STATUS.REJECTED,
      VERIFICATION_STATUS.APPROVED,
      VERIFICATION_STATUS.REVOKED,
    ],
  },
} as const

const LIST_QUEUE_SELECT =
  'organisationName role sector verification createdAt serviceLocation pickupAddress'

const LIST_SELECT =
  'organisationName role sector phone email contactName registrationNumber dailyCapacity transport transportAvailable verification createdAt serviceLocation pickupAddress businessRegistrationNumber'

type VerificationDoc = {
  status?: string
  submittedAt?: Date
  reviewedAt?: Date
  reviewedBy?: mongoose.Types.ObjectId
  reason?: string
  reasonCode?: string
  reasonDetails?: string
  documents?: StoredVerificationDocumentLike[]
}

type ApplicantLean = {
  _id: mongoose.Types.ObjectId
  organisationName?: string
  role: Role
  sector?: string
  phone?: string
  email?: string
  contactName?: string
  registrationNumber?: string
  businessRegistrationNumber?: string
  dailyCapacity?: number
  transportAvailable?: boolean
  transport?: {
    hasOwnTransport?: boolean
    mode?: string
  }
  verification?: VerificationDoc
  createdAt?: Date
  serviceLocation?: { address?: string }
  pickupAddress?: string
}

export type SerializedVerificationListItem = {
  id: string
  organisationName: string
  role: Role
  sectorLabel: string
  submittedAt: string
  waitingSince: string
  status: VerificationStatus
  review?: {
    reviewedBy?: string
    reviewedAt?: string
    action: 'approved' | 'rejected' | 'revoked'
  }
}

export type DuplicateCheckResult = {
  hasDuplicates: boolean
  phoneClash?: { organisationName: string }
  registrationNumberClash?: { organisationName: string }
}

export type SerializedVerificationDetail = {
  id: string
  organisationName: string
  role: Role
  contactName: string
  phone: string
  email: string
  registrationNumber?: string
  dailyCapacity?: number
  transportLabel?: string
  sectorLabel: string
  submittedAt: string
  waitingSince: string
  status: string
  document?: {
    filename: string
    resourceType?: string
    format?: string
  }
  duplicateCheck: DuplicateCheckResult
  review?: {
    reviewedBy?: string
    reviewedByName?: string
    reviewedAt?: string
    reasonCode?: string
    reason?: string
    reasonDetails?: string
  }
}

function resolveSubmittedAt(user: ApplicantLean): Date {
  return user.verification?.submittedAt ?? user.createdAt ?? new Date()
}

function resolveSectorLabel(user: ApplicantLean): string {
  if (user.role === ROLES.NGO && user.sector) {
    const labels: Record<string, string> = {
      [NGO_SECTOR.ORPHANAGE]: 'Orphanage',
      [NGO_SECTOR.SHELTER]: 'Shelter',
      [NGO_SECTOR.COMMUNITY_CENTRE]: 'Community centre',
    }
    return labels[user.sector] ?? user.sector
  }

  const address =
    user.serviceLocation?.address?.trim() ||
    user.pickupAddress?.trim() ||
    ''

  return address || '—'
}

function resolveTransportLabel(user: ApplicantLean): string | undefined {
  if (user.role !== ROLES.NGO) return undefined

  const capacity = resolveNgoCapacityFromSource(user)
  if (!capacity.transport.hasOwnTransport) {
    return 'No own transport'
  }

  const mode = capacity.transport.mode
  if (!mode) return 'Own transport available'

  const labels: Record<string, string> = {
    van: 'Van',
    motorbike: 'Motorbike',
    on_foot: 'On foot',
  }

  return `Own transport (${labels[mode] ?? mode})`
}

function serializeListItem(user: ApplicantLean): SerializedVerificationListItem {
  const submittedAt = resolveSubmittedAt(user)
  const status = (user.verification?.status ??
    VERIFICATION_STATUS.PENDING) as VerificationStatus

  const review =
    status !== VERIFICATION_STATUS.PENDING &&
    (user.verification?.reviewedAt || user.verification?.reviewedBy)
      ? {
          reviewedBy: user.verification!.reviewedBy?.toString(),
          reviewedAt: user.verification!.reviewedAt?.toISOString(),
          action:
            status === VERIFICATION_STATUS.APPROVED
              ? ('approved' as const)
              : status === VERIFICATION_STATUS.REVOKED
                ? ('revoked' as const)
                : ('rejected' as const),
        }
      : undefined

  return {
    id: user._id.toString(),
    organisationName: user.organisationName?.trim() || 'Organisation',
    role: user.role,
    sectorLabel: resolveSectorLabel(user),
    submittedAt: submittedAt.toISOString(),
    waitingSince: submittedAt.toISOString(),
    status,
    review,
  }
}

async function findReviewerName(
  reviewedBy?: mongoose.Types.ObjectId | null,
): Promise<string | undefined> {
  if (!reviewedBy) return undefined

  const reviewer = await Admin.findById(reviewedBy).select('name').lean()
  return typeof (reviewer as { name?: string } | null)?.name === 'string'
    ? (reviewer as { name: string }).name.trim()
    : undefined
}

async function throwIfAlreadyHandled(verification: VerificationDoc | undefined) {
  if (!verification || verification.status === VERIFICATION_STATUS.PENDING) {
    return
  }

  const reviewerName = await findReviewerName(verification.reviewedBy ?? null)
  const reviewedAt = verification.reviewedAt
  const when = reviewedAt
    ? reviewedAt.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'an earlier time'

  throw conflict(
    `Already handled by ${reviewerName ?? 'another admin'} on ${when}`,
    'VERIFICATION_ALREADY_HANDLED',
  )
}

export async function countPendingVerifications(): Promise<number> {
  // Use aggregate $count — countDocuments diverges from list $match under strictQuery + discriminators.
  const [result] = await User.aggregate<{ count: number }>([
    { $match: PENDING_FILTER },
    { $count: 'count' },
  ])
  return result?.count ?? 0
}

export async function countPendingVerificationsWaitingOverHours(
  hours: number,
  now = new Date(),
): Promise<number> {
  const threshold = new Date(now.getTime() - hours * 60 * 60 * 1000)

  const [result] = await User.aggregate<{ count: number }>([
    { $match: PENDING_FILTER },
    {
      $addFields: {
        submittedAt: {
          $ifNull: ['$verification.submittedAt', '$createdAt'],
        },
      },
    },
    { $match: { submittedAt: { $lte: threshold } } },
    { $count: 'count' },
  ])

  return result?.count ?? 0
}

export async function listVerifications(query: AdminVerificationsQuery) {
  const page = query.page
  const pageSize = query.pageSize

  const [countRows, totalPending, users] = await Promise.all([
    User.aggregate<{ count: number }>([
      { $match: ALL_VERIFICATIONS_FILTER },
      { $count: 'count' },
    ]),
    countPendingVerifications(),
    User.aggregate<ApplicantLean>([
      { $match: ALL_VERIFICATIONS_FILTER },
      {
        $addFields: {
          sortBucket: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ['$verification.status', VERIFICATION_STATUS.PENDING],
                  },
                  then: 0,
                },
                {
                  case: {
                    $eq: ['$verification.status', VERIFICATION_STATUS.REJECTED],
                  },
                  then: 1,
                },
                {
                  case: {
                    $eq: ['$verification.status', VERIFICATION_STATUS.REVOKED],
                  },
                  then: 2,
                },
                {
                  case: {
                    $eq: ['$verification.status', VERIFICATION_STATUS.APPROVED],
                  },
                  then: 3,
                },
              ],
              default: 4,
            },
          },
          pendingWait: {
            $cond: [
              { $eq: ['$verification.status', VERIFICATION_STATUS.PENDING] },
              { $ifNull: ['$verification.submittedAt', '$createdAt'] },
              null,
            ],
          },
          handledAt: {
            $cond: [
              { $ne: ['$verification.status', VERIFICATION_STATUS.PENDING] },
              '$verification.reviewedAt',
              null,
            ],
          },
        },
      },
      { $sort: { sortBucket: 1, pendingWait: 1, handledAt: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $project: {
          organisationName: 1,
          role: 1,
          sector: 1,
          verification: 1,
          createdAt: 1,
          serviceLocation: 1,
          pickupAddress: 1,
        },
      },
    ]),
  ])

  const totalItems = countRows[0]?.count ?? 0

  return {
    items: users.map(serializeListItem),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
    /** Pending-only count for the sidebar badge — not pagination.totalItems */
    totalPending,
  }
}

export async function broadcastVerificationNew(applicantId: string) {
  const user = await User.findOne({
    _id: applicantId,
    role: { $in: [ROLES.DONOR, ROLES.NGO] },
    'verification.status': VERIFICATION_STATUS.PENDING,
  })
    .select(LIST_QUEUE_SELECT)
    .lean<ApplicantLean>()

  if (!user) {
    return
  }

  const pendingCount = await countPendingVerifications()
  emitVerificationNew({
    item: serializeListItem(user),
    pendingCount,
  })

  void notifyAdminsOfNewVerification({
    organisationName: user.organisationName?.trim() || 'An organisation',
    role: user.role as typeof ROLES.DONOR | typeof ROLES.NGO,
  })
}

export async function checkDuplicateApplication(
  user: ApplicantLean,
): Promise<DuplicateCheckResult> {
  const userId = user._id
  const result: DuplicateCheckResult = { hasDuplicates: false }

  if (user.phone) {
    const normalized = normalizePhone(user.phone)
    if (normalized) {
      const phoneMatch = await User.findOne({
        _id: { $ne: userId },
        phone: normalized,
      })
        .select('organisationName')
        .lean<{ organisationName?: string }>()

      if (phoneMatch) {
        result.hasDuplicates = true
        result.phoneClash = {
          organisationName:
            phoneMatch.organisationName?.trim() || 'Another organisation',
        }
      }
    }
  }

  const registrationNumber =
    user.role === ROLES.NGO
      ? user.registrationNumber?.trim()
      : user.businessRegistrationNumber?.trim()

  if (registrationNumber) {
    const regFilter =
      user.role === ROLES.NGO
        ? { registrationNumber, role: ROLES.NGO }
        : { businessRegistrationNumber: registrationNumber, role: ROLES.DONOR }

    const regMatch = await User.findOne({
      _id: { $ne: userId },
      ...regFilter,
    })
      .select('organisationName')
      .lean<{ organisationName?: string }>()

    if (regMatch) {
      result.hasDuplicates = true
      result.registrationNumberClash = {
        organisationName:
          regMatch.organisationName?.trim() || 'Another organisation',
      }
    }
  }

  return result
}

async function loadApplicantById(id: string): Promise<ApplicantLean> {
  if (!mongoose.isValidObjectId(id)) {
    throw notFound('Application not found', 'VERIFICATION_NOT_FOUND')
  }

  const user = await User.findOne({
    _id: id,
    role: { $in: [ROLES.DONOR, ROLES.NGO] },
  })
    .select(LIST_SELECT)
    .lean<ApplicantLean>()

  if (!user) {
    throw notFound('Application not found', 'VERIFICATION_NOT_FOUND')
  }

  return user
}

export async function getVerificationDetail(
  id: string,
): Promise<SerializedVerificationDetail> {
  const user = await loadApplicantById(id)
  const submittedAt = resolveSubmittedAt(user)
  const documents = user.verification?.documents ?? []
  const latest = documents[documents.length - 1]
  const duplicateCheck = await checkDuplicateApplication(user)

  const review =
    user.verification?.reviewedAt || user.verification?.reviewedBy
      ? {
          reviewedBy: user.verification.reviewedBy?.toString(),
          reviewedByName: await findReviewerName(user.verification.reviewedBy),
          reviewedAt: user.verification.reviewedAt?.toISOString(),
          reasonCode: user.verification.reasonCode,
          reason: user.verification.reason,
          reasonDetails: user.verification.reasonDetails,
        }
      : undefined

  return {
    id: user._id.toString(),
    organisationName: user.organisationName?.trim() || 'Organisation',
    role: user.role,
    contactName: user.contactName?.trim() || '—',
    phone: user.phone?.trim() || '—',
    email: user.email?.trim() || '—',
    registrationNumber:
      user.role === ROLES.NGO
        ? user.registrationNumber?.trim()
        : user.businessRegistrationNumber?.trim(),
    dailyCapacity:
      user.role === ROLES.NGO && typeof user.dailyCapacity === 'number'
        ? user.dailyCapacity
        : undefined,
    transportLabel: resolveTransportLabel(user),
    sectorLabel: resolveSectorLabel(user),
    submittedAt: submittedAt.toISOString(),
    waitingSince: submittedAt.toISOString(),
    status: (user.verification?.status ??
      VERIFICATION_STATUS.PENDING) as VerificationStatus,
    document: latest
      ? {
          filename: latest.filename,
          resourceType: latest.resourceType,
          format: latest.format,
        }
      : undefined,
    duplicateCheck,
    review,
  }
}

export async function getVerificationDocumentView(id: string) {
  const user = await loadApplicantById(id)
  const documents = user.verification?.documents ?? []
  const latest = documents[documents.length - 1]

  if (!latest) {
    throw notFound('No verification document found', 'DOCUMENT_NOT_FOUND')
  }

  const signingMetadata = resolveDocumentSigningMetadata(latest)
  if (!signingMetadata) {
    throw notFound('No verification document found', 'DOCUMENT_NOT_FOUND')
  }

  return getSignedCertificateView(signingMetadata)
}

async function notifyApplicantDecision(input: {
  userId: string
  organisationName: string
  type: typeof NOTIFICATION_TYPE.VERIFICATION_APPROVED | typeof NOTIFICATION_TYPE.VERIFICATION_REJECTED
  body: string
}) {
  await createInAppNotificationForUser({
    userId: input.userId,
    type: input.type,
    title:
      input.type === NOTIFICATION_TYPE.VERIFICATION_APPROVED
        ? 'Verification approved'
        : 'Verification not approved',
    body: input.body,
  })
}

async function broadcastVerificationUpdate(input: {
  id: string
  newStatus: typeof VERIFICATION_STATUS.APPROVED | typeof VERIFICATION_STATUS.REJECTED
  reviewedBy: string
  reviewedByName?: string
  reviewedAt: string
}): Promise<number> {
  const pendingCount = await countPendingVerifications()
  emitVerificationUpdated({
    id: input.id,
    newStatus: input.newStatus,
    reviewedBy: input.reviewedBy,
    reviewedByName: input.reviewedByName,
    reviewedAt: input.reviewedAt,
    pendingCount,
  })
  return pendingCount
}

export type VerificationDecisionResult = {
  application: SerializedVerificationDetail
  pendingCount: number
}

export async function approveVerification(input: {
  applicantId: string
  adminId: string
  adminName?: string
}) {
  const user = await User.findById(input.applicantId)
  if (!user || (user.role !== ROLES.DONOR && user.role !== ROLES.NGO)) {
    throw notFound('Application not found', 'VERIFICATION_NOT_FOUND')
  }

  const verification = (user as { verification?: VerificationDoc }).verification
  await throwIfAlreadyHandled(verification)

  const now = new Date()
  verification!.status = VERIFICATION_STATUS.APPROVED
  verification!.reviewedAt = now
  verification!.reviewedBy = new mongoose.Types.ObjectId(input.adminId)
  verification!.reason = undefined
  verification!.reasonCode = undefined
  verification!.reasonDetails = undefined

  user.markModified('verification')
  await user.save()

  const organisationName =
    (user as { organisationName?: string }).organisationName?.trim() ||
    'Organisation'

  await sendVerificationApprovedEmail({
    to: user.email,
    organisationName,
  })

  await notifyApplicantDecision({
    userId: user._id.toString(),
    organisationName,
    type: NOTIFICATION_TYPE.VERIFICATION_APPROVED,
    body: 'Your organisation has been verified. You can sign in and start using Sangira.',
  })

  const pendingCount = await broadcastVerificationUpdate({
    id: user._id.toString(),
    newStatus: VERIFICATION_STATUS.APPROVED,
    reviewedBy: input.adminId,
    reviewedByName: input.adminName,
    reviewedAt: now.toISOString(),
  })

  return {
    application: await getVerificationDetail(user._id.toString()),
    pendingCount,
  }
}

export async function rejectVerification(input: {
  applicantId: string
  adminId: string
  adminName?: string
  payload: RejectVerificationInput
}) {
  const user = await User.findById(input.applicantId)
  if (!user || (user.role !== ROLES.DONOR && user.role !== ROLES.NGO)) {
    throw notFound('Application not found', 'VERIFICATION_NOT_FOUND')
  }

  const verification = (user as { verification?: VerificationDoc }).verification
  await throwIfAlreadyHandled(verification)

  const reasonCode = input.payload.reasonCode as VerificationRejectReasonCode
  const reasonLabel = VERIFICATION_REJECT_REASON_LABELS[reasonCode]
  const details = input.payload.details?.trim()
  const now = new Date()

  verification!.status = VERIFICATION_STATUS.REJECTED
  verification!.reviewedAt = now
  verification!.reviewedBy = new mongoose.Types.ObjectId(input.adminId)
  verification!.reasonCode = reasonCode
  verification!.reasonDetails = details
  verification!.reason = details
    ? `${reasonLabel}: ${details}`
    : reasonLabel

  user.markModified('verification')
  await user.save()

  const organisationName =
    (user as { organisationName?: string }).organisationName?.trim() ||
    'Organisation'

  await sendVerificationRejectedEmail({
    to: user.email,
    organisationName,
    reasonLabel,
    details,
  })

  await notifyApplicantDecision({
    userId: user._id.toString(),
    organisationName,
    type: NOTIFICATION_TYPE.VERIFICATION_REJECTED,
    body: details ? `${reasonLabel}: ${details}` : reasonLabel,
  })

  const pendingCount = await broadcastVerificationUpdate({
    id: user._id.toString(),
    newStatus: VERIFICATION_STATUS.REJECTED,
    reviewedBy: input.adminId,
    reviewedByName: input.adminName,
    reviewedAt: now.toISOString(),
  })

  return {
    application: await getVerificationDetail(user._id.toString()),
    pendingCount,
  }
}
