import mongoose from 'mongoose'
import {
  LISTING_STATUS,
  REQUEST_STATUS,
  ROLES,
  VERIFICATION_STATUS,
} from '../constants/enums.js'
import {
  ADMIN_OVERVIEW_ACTIVITY_PER_SOURCE_LIMIT,
  ADMIN_OVERVIEW_ACTIVITY_TYPE,
  ADMIN_OVERVIEW_ACTIVITY_LOOKBACK_DAYS,
  ADMIN_OVERVIEW_RECENT_ACTIVITY_LIMIT,
  type AdminOverviewActivityType,
} from '../constants/admin-overview.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'

export type AdminPlatformActivityEvent = {
  id: string
  type: AdminOverviewActivityType
  subject: string
  timestamp: string
  awaitingReview?: boolean
}

type PlatformActivityFetchOptions = {
  perSourceLimit?: number
}

function activityLookbackDate(now: Date): Date {
  const lookback = new Date(now)
  lookback.setDate(lookback.getDate() - ADMIN_OVERVIEW_ACTIVITY_LOOKBACK_DAYS)
  return lookback
}

function formatOrgName(value: string | null | undefined, fallback: string) {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed || fallback
}

type VerificationActivityRow = {
  _id: { toString(): string }
  organisationName?: string | null
  verification?: {
    status?: string
    reviewedAt?: Date
  } | null
}

async function fetchVerificationActivityEvents(
  since: Date,
  options: PlatformActivityFetchOptions = {},
): Promise<AdminPlatformActivityEvent[]> {
  let query = User.find({
    role: { $in: [ROLES.DONOR, ROLES.NGO] },
    'verification.status': {
      $in: [VERIFICATION_STATUS.APPROVED, VERIFICATION_STATUS.REJECTED],
    },
    'verification.reviewedAt': { $gte: since },
  })
    .select('organisationName verification.status verification.reviewedAt')
    .sort({ 'verification.reviewedAt': -1 })

  if (options.perSourceLimit !== undefined) {
    query = query.limit(options.perSourceLimit)
  }

  const users = await query.lean<VerificationActivityRow[]>()

  return users.reduce<AdminPlatformActivityEvent[]>((events, user) => {
    const reviewedAt = user.verification?.reviewedAt
    if (!reviewedAt) return events

    const status = user.verification?.status
    const subject = formatOrgName(user.organisationName, 'Organisation')
    const id = user._id.toString()

    if (status === VERIFICATION_STATUS.APPROVED) {
      events.push({
        id: `verification-approved-${id}`,
        type: ADMIN_OVERVIEW_ACTIVITY_TYPE.VERIFICATION_APPROVED,
        subject,
        timestamp: reviewedAt.toISOString(),
      })
    } else if (status === VERIFICATION_STATUS.REJECTED) {
      events.push({
        id: `verification-rejected-${id}`,
        type: ADMIN_OVERVIEW_ACTIVITY_TYPE.VERIFICATION_REJECTED,
        subject,
        timestamp: reviewedAt.toISOString(),
      })
    }

    return events
  }, [])
}

type ListingActivityRow = {
  _id: { toString(): string }
  title: string
  createdAt: Date
  donor?: { organisationName?: string | null } | null
}

async function fetchListingPostedEvents(
  since: Date,
  options: PlatformActivityFetchOptions = {},
): Promise<AdminPlatformActivityEvent[]> {
  let query = Listing.find({ createdAt: { $gte: since } })
    .select('title createdAt donor')
    .populate({ path: 'donor', model: User, select: 'organisationName' })
    .sort({ createdAt: -1 })

  if (options.perSourceLimit !== undefined) {
    query = query.limit(options.perSourceLimit)
  }

  const listings = await query.lean<ListingActivityRow[]>()

  return listings.map((listing) => {
    const donorName = formatOrgName(
      listing.donor?.organisationName,
      'Donor organisation',
    )
    return {
      id: `listing-posted-${listing._id.toString()}`,
      type: ADMIN_OVERVIEW_ACTIVITY_TYPE.LISTING_POSTED,
      subject: `${listing.title}, ${donorName}`,
      timestamp: listing.createdAt.toISOString(),
    }
  })
}

type TransferActivityRow = {
  _id: { toString(): string }
  confirmation?: { completedAt?: Date | null } | null
  listing?: { title?: string | null } | null
  ngo?: { organisationName?: string | null } | null
}

async function fetchTransferCompletedEvents(
  since: Date,
  options: PlatformActivityFetchOptions = {},
): Promise<AdminPlatformActivityEvent[]> {
  let query = FoodRequest.find({
    status: REQUEST_STATUS.COMPLETED,
    'confirmation.completedAt': { $gte: since },
  })
    .select('confirmation.completedAt listing ngo')
    .populate([
      { path: 'listing', model: Listing, select: 'title' },
      { path: 'ngo', model: User, select: 'organisationName' },
    ])
    .sort({ 'confirmation.completedAt': -1 })

  if (options.perSourceLimit !== undefined) {
    query = query.limit(options.perSourceLimit)
  }

  const requests = await query.lean<TransferActivityRow[]>()

  return requests.flatMap((request) => {
    const completedAt = request.confirmation?.completedAt
    if (!completedAt) return []

    const listingTitle =
      typeof request.listing?.title === 'string'
        ? request.listing.title.trim()
        : 'Listing'
    const ngoName = formatOrgName(request.ngo?.organisationName, 'NGO')

    return [
      {
        id: `transfer-completed-${request._id.toString()}`,
        type: ADMIN_OVERVIEW_ACTIVITY_TYPE.TRANSFER_COMPLETED,
        subject: `${listingTitle}, ${ngoName}`,
        timestamp: completedAt.toISOString(),
      },
    ]
  })
}

type RegistrationActivityRow = {
  _id: { toString(): string }
  organisationName?: string | null
  createdAt: Date
  verification?: { submittedAt?: Date | null } | null
}

async function fetchRegistrationPendingEvents(
  since: Date,
  options: PlatformActivityFetchOptions = {},
): Promise<AdminPlatformActivityEvent[]> {
  let query = User.find({
    role: { $in: [ROLES.DONOR, ROLES.NGO] },
    'verification.status': VERIFICATION_STATUS.PENDING,
    $or: [
      { 'verification.submittedAt': { $gte: since } },
      {
        'verification.submittedAt': { $exists: false },
        createdAt: { $gte: since },
      },
    ],
  })
    .select('organisationName createdAt verification.submittedAt')
    .sort({ createdAt: -1 })

  if (options.perSourceLimit !== undefined) {
    query = query.limit(options.perSourceLimit)
  }

  const users = await query.lean<RegistrationActivityRow[]>()

  return users.map((user) => {
    const submittedAt = user.verification?.submittedAt ?? user.createdAt
    return {
      id: `registration-pending-${user._id.toString()}`,
      type: ADMIN_OVERVIEW_ACTIVITY_TYPE.REGISTRATION_PENDING,
      subject: formatOrgName(user.organisationName, 'New organisation'),
      timestamp: submittedAt.toISOString(),
      awaitingReview: true,
    }
  })
}

async function listingIdsWithAcceptedOrCompletedRequest(
  listingIds: mongoose.Types.ObjectId[],
): Promise<Set<string>> {
  if (listingIds.length === 0) return new Set()

  const matched = await FoodRequest.distinct('listing', {
    listing: { $in: listingIds },
    status: { $in: [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.COMPLETED] },
  })

  return new Set(matched.map((id) => id.toString()))
}

async function fetchListingExpiredUnmatchedEvents(
  since: Date,
  options: PlatformActivityFetchOptions = {},
): Promise<AdminPlatformActivityEvent[]> {
  let query = Listing.find({
    status: LISTING_STATUS.EXPIRED,
    expiresAt: { $gte: since },
  })
    .select('title expiresAt')
    .sort({ expiresAt: -1 })

  if (options.perSourceLimit !== undefined) {
    query = query.limit(options.perSourceLimit * 2)
  }

  const listings =
    await query.lean<{ _id: mongoose.Types.ObjectId; title: string; expiresAt: Date }[]>()

  const matchedIds = await listingIdsWithAcceptedOrCompletedRequest(
    listings.map((listing) => listing._id),
  )

  const unmatched = listings.filter(
    (listing) => !matchedIds.has(listing._id.toString()),
  )

  const capped =
    options.perSourceLimit !== undefined
      ? unmatched.slice(0, options.perSourceLimit)
      : unmatched

  return capped.map((listing) => ({
    id: `listing-expired-unmatched-${listing._id.toString()}`,
    type: ADMIN_OVERVIEW_ACTIVITY_TYPE.LISTING_EXPIRED_UNMATCHED,
    subject: listing.title,
    timestamp: listing.expiresAt.toISOString(),
  }))
}

export async function buildPlatformActivityEvents(
  now = new Date(),
  options: PlatformActivityFetchOptions = {},
): Promise<AdminPlatformActivityEvent[]> {
  const since = activityLookbackDate(now)

  const [
    verificationEvents,
    listingPostedEvents,
    transferEvents,
    registrationEvents,
    expiredEvents,
  ] = await Promise.all([
    fetchVerificationActivityEvents(since, options),
    fetchListingPostedEvents(since, options),
    fetchTransferCompletedEvents(since, options),
    fetchRegistrationPendingEvents(since, options),
    fetchListingExpiredUnmatchedEvents(since, options),
  ])

  return [
    ...verificationEvents,
    ...listingPostedEvents,
    ...transferEvents,
    ...registrationEvents,
    ...expiredEvents,
  ].sort(
    (left, right) =>
      new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  )
}

export async function buildRecentPlatformActivity(
  now = new Date(),
): Promise<AdminPlatformActivityEvent[]> {
  const events = await buildPlatformActivityEvents(now, {
    perSourceLimit: ADMIN_OVERVIEW_ACTIVITY_PER_SOURCE_LIMIT,
  })

  return events.slice(0, ADMIN_OVERVIEW_RECENT_ACTIVITY_LIMIT)
}

function paginatePlatformActivity(
  events: AdminPlatformActivityEvent[],
  page: number,
  pageSize: number,
) {
  const totalItems = events.length
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize)
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const offset = (safePage - 1) * pageSize

  return {
    activity: events.slice(offset, offset + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
    },
  }
}

export async function listAdminActivityPaginated(input: {
  page: number
  pageSize: number
}) {
  const events = await buildPlatformActivityEvents()
  return paginatePlatformActivity(events, input.page, input.pageSize)
}
