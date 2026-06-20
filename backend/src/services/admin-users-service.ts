import mongoose from 'mongoose'
import {
  sendAccountReactivatedEmail,
  sendAccountSuspendedEmail,
  sendVerificationApprovedEmail,
  sendVerificationRevokedEmail,
} from '../notifications/index.js'
import {
  ACCOUNT_STATUS,
  NGO_SECTOR,
  NOTIFICATION_TYPE,
  REQUEST_STATUS,
  ROLES,
  VERIFICATION_STATUS,
  type Role,
} from '../constants/enums.js'
import {
  ADMIN_USER_ACTION,
  ADMIN_USER_LIST_ROLE_FILTER,
  ADMIN_USER_LIST_STATUS,
  ADMIN_USER_LIST_STATUS_FILTER,
  type AdminUserAction,
  type AdminUserListStatus,
} from '../constants/admin-users.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { Admin, User } from '../models/user.js'
import { resolveNgoCapacityFromSource } from '../utils/resolve-ngo-capacity.js'
import {
  conflict,
  forbidden,
  notFound,
} from '../utils/app-error.js'
import {
  resolveDocumentSigningMetadata,
  type StoredVerificationDocumentLike,
} from '../utils/verification-document.js'
import { createInAppNotificationForUser } from './admin-verification-notifications.js'
import { countPendingVerifications } from './admin-verification-service.js'
import { emitVerificationUpdated } from '../realtime/verification-events.js'
import type {
  AdminUserRequiredReasonInput,
  AdminUserOptionalReasonInput,
  AdminUsersQuery,
} from '../validators/admin-users.js'

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

type AdminAuditEntryDoc = {
  _id: mongoose.Types.ObjectId
  action: AdminUserAction
  actorAdminId: mongoose.Types.ObjectId
  actorAdminName?: string
  reason?: string
  timestamp: Date
}

type OrgUserLean = {
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
  accountStatus: string
  verification?: VerificationDoc
  createdAt?: Date
  serviceLocation?: { address?: string }
  pickupAddress?: string
  pickupLocation?: {
    type?: string
    coordinates?: number[]
    address?: string
  }
  adminAuditTrail?: AdminAuditEntryDoc[]
}

const ORG_USER_FILTER = {
  role: { $in: [ROLES.DONOR, ROLES.NGO] },
} as const

const DETAIL_SELECT =
  'organisationName role sector phone email contactName registrationNumber businessRegistrationNumber dailyCapacity transport transportAvailable accountStatus verification createdAt serviceLocation pickupAddress pickupLocation adminAuditTrail'

export type SerializedAdminUserListItem = {
  id: string
  organisationName: string
  verified: boolean
  role: Role
  sectorLabel: string
  transfersCount: number
  accountStatus: string
  listStatus: AdminUserListStatus
}

export type SerializedAdminAuditEntry = {
  id: string
  action: AdminUserAction
  actorAdminId: string
  actorAdminName?: string
  reason?: string
  timestamp: string
}

export type SerializedAdminUserDetail = {
  id: string
  organisationName: string
  role: Role
  contactName: string
  phone: string
  email: string
  accountStatus: string
  listStatus: AdminUserListStatus
  verificationStatus: string
  registrationNumber?: string
  dailyCapacity?: number
  transportLabel?: string
  sectorLabel: string
  locationLabel: string
  transfersCount: number
  submittedAt?: string
  verification?: {
    status: string
    reason?: string
    reasonCode?: string
    reasonDetails?: string
    reviewedAt?: string
    reviewedBy?: string
    reviewedByName?: string
    document?: {
      filename: string
      resourceType?: string
      format?: string
    }
  }
  auditTrail: SerializedAdminAuditEntry[]
}

export type AdminUserActionResult = {
  user: SerializedAdminUserDetail
}

function resolveSectorLabel(user: OrgUserLean): string {
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
    user.pickupLocation?.address?.trim() ||
    ''

  return address || '—'
}

function resolveTransportLabel(user: OrgUserLean): string | undefined {
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

export function resolveAdminUserListStatus(user: {
  accountStatus: string
  verification?: { status?: string }
}): AdminUserListStatus {
  if (user.verification?.status === VERIFICATION_STATUS.REVOKED) {
    return ADMIN_USER_LIST_STATUS.REVOKED
  }

  if (user.accountStatus === ACCOUNT_STATUS.SUSPENDED) {
    return ADMIN_USER_LIST_STATUS.SUSPENDED
  }

  if (user.accountStatus === ACCOUNT_STATUS.FLAGGED) {
    return ADMIN_USER_LIST_STATUS.FLAGGED
  }

  return ADMIN_USER_LIST_STATUS.ACTIVE
}

async function findReviewerName(
  reviewedBy?: mongoose.Types.ObjectId | null,
): Promise<string | undefined> {
  if (!reviewedBy) return undefined

  const reviewer = await Admin.findById(reviewedBy).select('name').lean()
  const name = (reviewer as { name?: string } | null)?.name
  return typeof name === 'string' && name.trim() ? name.trim() : undefined
}

async function countTransfersForUser(
  userId: mongoose.Types.ObjectId,
  role: Role,
): Promise<number> {
  if (role === ROLES.DONOR) {
    const listingIds = await Listing.distinct('_id', { donor: userId })

    if (listingIds.length === 0) return 0

    return FoodRequest.countDocuments({
      listing: { $in: listingIds as mongoose.Types.ObjectId[] },
      status: REQUEST_STATUS.COMPLETED,
    })
  }

  return FoodRequest.countDocuments({
    ngo: userId,
    status: REQUEST_STATUS.COMPLETED,
  })
}

function buildSearchFilter(search?: string) {
  const term = search?.trim()
  if (!term) return {}

  const pattern = new RegExp(escapeRegex(term), 'i')

  return {
    $or: [
      { organisationName: pattern },
      { phone: pattern },
      { registrationNumber: pattern },
      { businessRegistrationNumber: pattern },
    ],
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildRoleFilter(role: AdminUsersQuery['role']) {
  if (role === ADMIN_USER_LIST_ROLE_FILTER.DONOR) {
    return { role: ROLES.DONOR }
  }

  if (role === ADMIN_USER_LIST_ROLE_FILTER.NGO) {
    return { role: ROLES.NGO }
  }

  return {}
}

function buildStatusFilter(status: AdminUsersQuery['status']) {
  switch (status) {
    case ADMIN_USER_LIST_STATUS_FILTER.REVOKED:
      return { 'verification.status': VERIFICATION_STATUS.REVOKED }
    case ADMIN_USER_LIST_STATUS_FILTER.SUSPENDED:
      return {
        accountStatus: ACCOUNT_STATUS.SUSPENDED,
        'verification.status': { $ne: VERIFICATION_STATUS.REVOKED },
      }
    case ADMIN_USER_LIST_STATUS_FILTER.FLAGGED:
      return {
        accountStatus: ACCOUNT_STATUS.FLAGGED,
        'verification.status': { $ne: VERIFICATION_STATUS.REVOKED },
      }
    case ADMIN_USER_LIST_STATUS_FILTER.ACTIVE:
      return {
        accountStatus: ACCOUNT_STATUS.ACTIVE,
        'verification.status': VERIFICATION_STATUS.APPROVED,
      }
    default:
      return {}
  }
}

async function loadOrgUserOrThrow(userId: string): Promise<OrgUserLean> {
  const user = await User.findOne({
    _id: userId,
    ...ORG_USER_FILTER,
  })
    .select(DETAIL_SELECT)
    .lean<OrgUserLean>()

  if (!user) {
    throw notFound('User not found', 'ADMIN_USER_NOT_FOUND')
  }

  return user
}

async function loadOrgUserDocumentOrThrow(userId: string) {
  const user = await User.findOne({
    _id: userId,
    ...ORG_USER_FILTER,
  }).select(DETAIL_SELECT)

  if (!user) {
    throw notFound('User not found', 'ADMIN_USER_NOT_FOUND')
  }

  return user
}

function assertNotAdmin(user: { role: string }) {
  if (user.role === ROLES.ADMIN) {
    throw forbidden('Admin accounts cannot be managed here', 'ADMIN_USER_FORBIDDEN')
  }
}

function appendAuditTrail(
  user: mongoose.Document & { adminAuditTrail?: AdminAuditEntryDoc[] },
  entry: {
    action: AdminUserAction
    actorAdminId: string
    actorAdminName?: string
    reason?: string
  },
) {
  const trail = user.adminAuditTrail ?? []
  trail.push({
    _id: new mongoose.Types.ObjectId(),
    action: entry.action,
    actorAdminId: new mongoose.Types.ObjectId(entry.actorAdminId),
    actorAdminName: entry.actorAdminName,
    reason: entry.reason,
    timestamp: new Date(),
  })
  user.adminAuditTrail = trail
  user.markModified('adminAuditTrail')
}

function serializeAuditTrail(
  entries: AdminAuditEntryDoc[] | undefined,
): SerializedAdminAuditEntry[] {
  return (entries ?? [])
    .slice()
    .sort(
      (left, right) =>
        new Date(right.timestamp).getTime() -
        new Date(left.timestamp).getTime(),
    )
    .map((entry) => ({
      id: entry._id.toString(),
      action: entry.action,
      actorAdminId: entry.actorAdminId.toString(),
      actorAdminName: entry.actorAdminName,
      reason: entry.reason,
      timestamp: entry.timestamp.toISOString(),
    }))
}

async function serializeAdminUserDetail(
  user: OrgUserLean,
  transfersCount?: number,
): Promise<SerializedAdminUserDetail> {
  const verification = user.verification
  const latestDocument = verification?.documents?.at(-1)
  const reviewedByName = await findReviewerName(verification?.reviewedBy ?? null)
  const count =
    transfersCount ??
    (await countTransfersForUser(user._id, user.role))

  return {
    id: user._id.toString(),
    organisationName: user.organisationName?.trim() || 'Organisation',
    role: user.role,
    contactName: user.contactName?.trim() || '—',
    phone: user.phone?.trim() || '—',
    email: user.email?.trim() || '—',
    accountStatus: user.accountStatus,
    listStatus: resolveAdminUserListStatus(user),
    verificationStatus:
      verification?.status ?? VERIFICATION_STATUS.PENDING,
    registrationNumber:
      user.role === ROLES.NGO
        ? user.registrationNumber?.trim()
        : user.businessRegistrationNumber?.trim(),
    dailyCapacity: user.role === ROLES.NGO ? user.dailyCapacity : undefined,
    transportLabel: resolveTransportLabel(user),
    sectorLabel: resolveSectorLabel(user),
    locationLabel: resolveSectorLabel(user),
    transfersCount: count,
    submittedAt: verification?.submittedAt?.toISOString(),
    verification: verification
      ? {
          status: verification.status ?? VERIFICATION_STATUS.PENDING,
          reason: verification.reason,
          reasonCode: verification.reasonCode,
          reasonDetails: verification.reasonDetails,
          reviewedAt: verification.reviewedAt?.toISOString(),
          reviewedBy: verification.reviewedBy?.toString(),
          reviewedByName,
          document: latestDocument
            ? {
                filename: latestDocument.filename,
                resourceType: latestDocument.resourceType,
                format: latestDocument.format,
              }
            : undefined,
        }
      : undefined,
    auditTrail: serializeAuditTrail(user.adminAuditTrail),
  }
}

async function serializeAdminUserListItem(
  user: OrgUserLean,
  transfersCount: number,
): Promise<SerializedAdminUserListItem> {
  return {
    id: user._id.toString(),
    organisationName: user.organisationName?.trim() || 'Organisation',
    verified: user.verification?.status === VERIFICATION_STATUS.APPROVED,
    role: user.role,
    sectorLabel: resolveSectorLabel(user),
    transfersCount,
    accountStatus: user.accountStatus,
    listStatus: resolveAdminUserListStatus(user),
  }
}

async function broadcastVerificationStatusChange(input: {
  userId: string
  adminId: string
  adminName?: string
  newStatus: typeof VERIFICATION_STATUS.APPROVED | typeof VERIFICATION_STATUS.REVOKED
}) {
  const pendingCount = await countPendingVerifications()
  emitVerificationUpdated({
    id: input.userId,
    newStatus: input.newStatus,
    reviewedBy: input.adminId,
    reviewedByName: input.adminName,
    reviewedAt: new Date().toISOString(),
    pendingCount,
  })
}

export async function listAdminUsers(query: AdminUsersQuery) {
  const page = query.page
  const pageSize = query.pageSize
  const filter = {
    ...ORG_USER_FILTER,
    ...buildRoleFilter(query.role),
    ...buildStatusFilter(query.status),
    ...buildSearchFilter(query.search),
  }

  const skip = (page - 1) * pageSize

  const [countRows, users] = await Promise.all([
    User.aggregate<{ count: number }>([
      { $match: filter },
      { $count: 'count' },
    ]),
    User.aggregate<OrgUserLean>([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]),
  ])

  const totalItems = countRows[0]?.count ?? 0

  const items = await Promise.all(
    users.map(async (user) => {
      const transfersCount = await countTransfersForUser(user._id, user.role)
      return serializeAdminUserListItem(user, transfersCount)
    }),
  )

  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize)

  return {
    users: items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  }
}

export async function getAdminUserDetail(userId: string) {
  const user = await loadOrgUserOrThrow(userId)
  return { user: await serializeAdminUserDetail(user) }
}

async function notifyAccountChange(input: {
  userId: string
  organisationName: string
  type:
    | typeof NOTIFICATION_TYPE.ACCOUNT_SUSPENDED
    | typeof NOTIFICATION_TYPE.ACCOUNT_REACTIVATED
    | typeof NOTIFICATION_TYPE.VERIFICATION_REVOKED
  body: string
}) {
  const titles: Record<string, string> = {
    [NOTIFICATION_TYPE.ACCOUNT_SUSPENDED]: 'Account suspended',
    [NOTIFICATION_TYPE.ACCOUNT_REACTIVATED]: 'Account reactivated',
    [NOTIFICATION_TYPE.VERIFICATION_REVOKED]: 'Verification revoked',
  }

  await createInAppNotificationForUser({
    userId: input.userId,
    type: input.type,
    title: titles[input.type] ?? 'Account update',
    body: input.body,
  })
}

export async function flagAdminUser(input: {
  userId: string
  adminId: string
  adminName?: string
  payload: AdminUserOptionalReasonInput
}) {
  const user = await loadOrgUserDocumentOrThrow(input.userId)
  assertNotAdmin(user)

  if (user.accountStatus === ACCOUNT_STATUS.FLAGGED) {
    throw conflict('Organisation is already flagged', 'ALREADY_FLAGGED')
  }

  user.accountStatus = ACCOUNT_STATUS.FLAGGED
  appendAuditTrail(user, {
    action: ADMIN_USER_ACTION.FLAG,
    actorAdminId: input.adminId,
    actorAdminName: input.adminName,
    reason: input.payload.reason,
  })

  await user.save()

  return {
    user: await serializeAdminUserDetail(
      user.toObject() as OrgUserLean,
    ),
  }
}

export async function unflagAdminUser(input: {
  userId: string
  adminId: string
  adminName?: string
}) {
  const user = await loadOrgUserDocumentOrThrow(input.userId)
  assertNotAdmin(user)

  if (user.accountStatus !== ACCOUNT_STATUS.FLAGGED) {
    throw conflict('Organisation is not flagged', 'NOT_FLAGGED')
  }

  user.accountStatus = ACCOUNT_STATUS.ACTIVE
  appendAuditTrail(user, {
    action: ADMIN_USER_ACTION.UNFLAG,
    actorAdminId: input.adminId,
    actorAdminName: input.adminName,
  })

  await user.save()

  return {
    user: await serializeAdminUserDetail(
      user.toObject() as OrgUserLean,
    ),
  }
}

export async function suspendAdminUser(input: {
  userId: string
  adminId: string
  adminName?: string
  payload: AdminUserRequiredReasonInput
}) {
  const user = await loadOrgUserDocumentOrThrow(input.userId)
  assertNotAdmin(user)

  if (user.accountStatus === ACCOUNT_STATUS.SUSPENDED) {
    throw conflict('Organisation is already suspended', 'ALREADY_SUSPENDED')
  }

  const organisationName =
    (user as { organisationName?: string }).organisationName?.trim() ||
    'Organisation'

  user.accountStatus = ACCOUNT_STATUS.SUSPENDED
  appendAuditTrail(user, {
    action: ADMIN_USER_ACTION.SUSPEND,
    actorAdminId: input.adminId,
    actorAdminName: input.adminName,
    reason: input.payload.reason,
  })

  await user.save()

  await sendAccountSuspendedEmail({
    to: user.email,
    organisationName,
    reason: input.payload.reason,
  })

  await notifyAccountChange({
    userId: user._id.toString(),
    organisationName,
    type: NOTIFICATION_TYPE.ACCOUNT_SUSPENDED,
    body: `Your account has been suspended. Reason: ${input.payload.reason}`,
  })

  return {
    user: await serializeAdminUserDetail(
      user.toObject() as OrgUserLean,
    ),
  }
}

export async function reactivateAdminUser(input: {
  userId: string
  adminId: string
  adminName?: string
}) {
  const user = await loadOrgUserDocumentOrThrow(input.userId)
  assertNotAdmin(user)

  if (user.accountStatus !== ACCOUNT_STATUS.SUSPENDED) {
    throw conflict('Organisation is not suspended', 'NOT_SUSPENDED')
  }

  const organisationName =
    (user as { organisationName?: string }).organisationName?.trim() ||
    'Organisation'

  user.accountStatus = ACCOUNT_STATUS.ACTIVE
  appendAuditTrail(user, {
    action: ADMIN_USER_ACTION.REACTIVATE,
    actorAdminId: input.adminId,
    actorAdminName: input.adminName,
  })

  await user.save()

  await sendAccountReactivatedEmail({
    to: user.email,
    organisationName,
  })

  await notifyAccountChange({
    userId: user._id.toString(),
    organisationName,
    type: NOTIFICATION_TYPE.ACCOUNT_REACTIVATED,
    body: 'Your account has been reactivated. You can resume using Sangira.',
  })

  return {
    user: await serializeAdminUserDetail(
      user.toObject() as OrgUserLean,
    ),
  }
}

export async function revokeAdminUserVerification(input: {
  userId: string
  adminId: string
  adminName?: string
  payload: AdminUserRequiredReasonInput
}) {
  const user = await loadOrgUserDocumentOrThrow(input.userId)
  assertNotAdmin(user)

  const verification = (user as { verification?: VerificationDoc }).verification
  if (!verification) {
    throw conflict('Organisation has no verification record', 'NO_VERIFICATION')
  }

  if (verification.status === VERIFICATION_STATUS.REVOKED) {
    throw conflict('Verification is already revoked', 'ALREADY_REVOKED')
  }

  if (verification.status !== VERIFICATION_STATUS.APPROVED) {
    throw conflict(
      'Only verified organisations can have verification revoked',
      'NOT_VERIFIED',
    )
  }

  const organisationName =
    (user as { organisationName?: string }).organisationName?.trim() ||
    'Organisation'
  const now = new Date()

  verification.status = VERIFICATION_STATUS.REVOKED
  verification.reviewedAt = now
  verification.reviewedBy = new mongoose.Types.ObjectId(input.adminId)
  verification.reason = input.payload.reason
  verification.reasonCode = undefined
  verification.reasonDetails = undefined

  user.markModified('verification')
  appendAuditTrail(user, {
    action: ADMIN_USER_ACTION.REVOKE_VERIFICATION,
    actorAdminId: input.adminId,
    actorAdminName: input.adminName,
    reason: input.payload.reason,
  })

  await user.save()

  await sendVerificationRevokedEmail({
    to: user.email,
    organisationName,
    reason: input.payload.reason,
  })

  await notifyAccountChange({
    userId: user._id.toString(),
    organisationName,
    type: NOTIFICATION_TYPE.VERIFICATION_REVOKED,
    body: `Your verification was revoked. Reason: ${input.payload.reason}`,
  })

  await broadcastVerificationStatusChange({
    userId: user._id.toString(),
    adminId: input.adminId,
    adminName: input.adminName,
    newStatus: VERIFICATION_STATUS.REVOKED,
  })

  return {
    user: await serializeAdminUserDetail(
      user.toObject() as OrgUserLean,
    ),
  }
}

export async function restoreAdminUserVerification(input: {
  userId: string
  adminId: string
  adminName?: string
}) {
  const user = await loadOrgUserDocumentOrThrow(input.userId)
  assertNotAdmin(user)

  const verification = (user as { verification?: VerificationDoc }).verification
  if (!verification) {
    throw conflict('Organisation has no verification record', 'NO_VERIFICATION')
  }

  if (verification.status !== VERIFICATION_STATUS.REVOKED) {
    throw conflict(
      'Only revoked organisations can have verification restored',
      'NOT_REVOKED',
    )
  }

  const organisationName =
    (user as { organisationName?: string }).organisationName?.trim() ||
    'Organisation'
  const now = new Date()

  verification.status = VERIFICATION_STATUS.APPROVED
  verification.reviewedAt = now
  verification.reviewedBy = new mongoose.Types.ObjectId(input.adminId)
  verification.reason = undefined
  verification.reasonCode = undefined
  verification.reasonDetails = undefined

  user.markModified('verification')
  appendAuditTrail(user, {
    action: ADMIN_USER_ACTION.RESTORE_VERIFICATION,
    actorAdminId: input.adminId,
    actorAdminName: input.adminName,
  })

  await user.save()

  await sendVerificationApprovedEmail({
    to: user.email,
    organisationName,
  })

  await createInAppNotificationForUser({
    userId: user._id.toString(),
    type: NOTIFICATION_TYPE.VERIFICATION_APPROVED,
    title: 'Verification restored',
    body: 'Your organisation verification has been restored. You can resume using Sangira.',
  })

  await broadcastVerificationStatusChange({
    userId: user._id.toString(),
    adminId: input.adminId,
    adminName: input.adminName,
    newStatus: VERIFICATION_STATUS.APPROVED,
  })

  return {
    user: await serializeAdminUserDetail(
      user.toObject() as OrgUserLean,
    ),
  }
}

export async function getAdminUserDocumentView(userId: string) {
  const user = await loadOrgUserOrThrow(userId)
  const documents = user.verification?.documents ?? []
  const latest = documents[documents.length - 1]

  if (!latest) {
    throw notFound('No verification document found', 'DOCUMENT_NOT_FOUND')
  }

  const signingMetadata = resolveDocumentSigningMetadata(latest)
  if (!signingMetadata) {
    throw notFound('No verification document found', 'DOCUMENT_NOT_FOUND')
  }

  const { getSignedCertificateView } = await import('../config/cloudinary.js')
  return getSignedCertificateView(signingMetadata)
}
