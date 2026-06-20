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
  ADMIN_OVERVIEW_FLAG_TYPE,
  ADMIN_OVERVIEW_FLAG_REVIEW_PATH,
  ADMIN_OVERVIEW_FLAGS_LIMIT,
  ADMIN_OVERVIEW_PENDING_URGENT_HOURS,
  ADMIN_OVERVIEW_RECENT_ACTIVITY_LIMIT,
  ADMIN_OVERVIEW_STUCK_HANDOVER_HOURS,
  type AdminOverviewActivityType,
  type AdminOverviewFlagType,
} from '../constants/admin-overview.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'
import {
  countPendingVerifications,
  countPendingVerificationsWaitingOverHours,
} from './admin-verification-service.js'

export type AdminOverviewActivityEvent = {
  id: string
  type: AdminOverviewActivityType
  subject: string
  timestamp: string
  awaitingReview?: boolean
}

export type AdminOverviewFlag = {
  type: AdminOverviewFlagType
  title: string
  detail: string
  count: number
  reviewPath: string
}

export type AdminOverviewData = {
  stats: {
    pendingVerifications: number
    pendingOver48h: number
    activeListings: number
    transfersThisWeek: number
    transfersLastWeekDelta: number
    registeredOrganisations: number
    registeredBreakdown: { donors: number; ngos: number }
  }
  recentActivity: AdminOverviewActivityEvent[]
  flags: AdminOverviewFlag[]
}

function startOfCalendarWeek(date: Date): Date {
  const start = new Date(date)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)
  start.setHours(0, 0, 0, 0)
  return start
}

function startOfCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
}

function endOfCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0)
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

async function countActiveListings(now = new Date()): Promise<number> {
  return Listing.countDocuments({
    status: LISTING_STATUS.ACTIVE,
    expiresAt: { $gt: now },
  })
}

async function countCompletedTransfersBetween(
  start: Date,
  end: Date,
): Promise<number> {
  return FoodRequest.countDocuments({
    status: REQUEST_STATUS.COMPLETED,
    'confirmation.completedAt': { $gte: start, $lt: end },
  })
}

async function countRegisteredOrganisations(now = new Date()) {
  void now
  const approvedFilter = {
    role: { $in: [ROLES.DONOR, ROLES.NGO] },
    'verification.status': VERIFICATION_STATUS.APPROVED,
  } as const

  const [total, donors, ngos] = await Promise.all([
    User.aggregate<{ count: number }>([
      { $match: approvedFilter },
      { $count: 'count' },
    ]).then((rows) => rows[0]?.count ?? 0),
    User.aggregate<{ count: number }>([
      { $match: { ...approvedFilter, role: ROLES.DONOR } },
      { $count: 'count' },
    ]).then((rows) => rows[0]?.count ?? 0),
    User.aggregate<{ count: number }>([
      { $match: { ...approvedFilter, role: ROLES.NGO } },
      { $count: 'count' },
    ]).then((rows) => rows[0]?.count ?? 0),
  ])

  return { total, donors, ngos }
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
): Promise<AdminOverviewActivityEvent[]> {
  const users = await User.find({
    role: { $in: [ROLES.DONOR, ROLES.NGO] },
    'verification.status': {
      $in: [VERIFICATION_STATUS.APPROVED, VERIFICATION_STATUS.REJECTED],
    },
    'verification.reviewedAt': { $gte: since },
  })
    .select('organisationName verification.status verification.reviewedAt')
    .sort({ 'verification.reviewedAt': -1 })
    .limit(ADMIN_OVERVIEW_ACTIVITY_PER_SOURCE_LIMIT)
    .lean<VerificationActivityRow[]>()

  return users.reduce<AdminOverviewActivityEvent[]>((events, user) => {
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
  expiresAt: Date
  donor?: { organisationName?: string | null } | null
}

async function fetchListingPostedEvents(
  since: Date,
): Promise<AdminOverviewActivityEvent[]> {
  const listings = await Listing.find({ createdAt: { $gte: since } })
    .select('title createdAt donor')
    .populate({ path: 'donor', model: User, select: 'organisationName' })
    .sort({ createdAt: -1 })
    .limit(ADMIN_OVERVIEW_ACTIVITY_PER_SOURCE_LIMIT)
    .lean<ListingActivityRow[]>()

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
): Promise<AdminOverviewActivityEvent[]> {
  const requests = await FoodRequest.find({
    status: REQUEST_STATUS.COMPLETED,
    'confirmation.completedAt': { $gte: since },
  })
    .select('confirmation.completedAt listing ngo')
    .populate([
      { path: 'listing', model: Listing, select: 'title' },
      { path: 'ngo', model: User, select: 'organisationName' },
    ])
    .sort({ 'confirmation.completedAt': -1 })
    .limit(ADMIN_OVERVIEW_ACTIVITY_PER_SOURCE_LIMIT)
    .lean<TransferActivityRow[]>()

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
): Promise<AdminOverviewActivityEvent[]> {
  const users = await User.find({
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
    .limit(ADMIN_OVERVIEW_ACTIVITY_PER_SOURCE_LIMIT)
    .lean<RegistrationActivityRow[]>()

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
): Promise<AdminOverviewActivityEvent[]> {
  const listings = await Listing.find({
    status: LISTING_STATUS.EXPIRED,
    expiresAt: { $gte: since },
  })
    .select('title expiresAt')
    .sort({ expiresAt: -1 })
    .limit(ADMIN_OVERVIEW_ACTIVITY_PER_SOURCE_LIMIT * 2)
    .lean<{ _id: mongoose.Types.ObjectId; title: string; expiresAt: Date }[]>()

  const matchedIds = await listingIdsWithAcceptedOrCompletedRequest(
    listings.map((listing) => listing._id),
  )

  return listings
    .filter((listing) => !matchedIds.has(listing._id.toString()))
    .slice(0, ADMIN_OVERVIEW_ACTIVITY_PER_SOURCE_LIMIT)
    .map((listing) => ({
      id: `listing-expired-unmatched-${listing._id.toString()}`,
      type: ADMIN_OVERVIEW_ACTIVITY_TYPE.LISTING_EXPIRED_UNMATCHED,
      subject: listing.title,
      timestamp: listing.expiresAt.toISOString(),
    }))
}

async function buildRecentActivity(
  now = new Date(),
): Promise<AdminOverviewActivityEvent[]> {
  const since = activityLookbackDate(now)

  const [
    verificationEvents,
    listingPostedEvents,
    transferEvents,
    registrationEvents,
    expiredEvents,
  ] = await Promise.all([
    fetchVerificationActivityEvents(since),
    fetchListingPostedEvents(since),
    fetchTransferCompletedEvents(since),
    fetchRegistrationPendingEvents(since),
    fetchListingExpiredUnmatchedEvents(since),
  ])

  return [
    ...verificationEvents,
    ...listingPostedEvents,
    ...transferEvents,
    ...registrationEvents,
    ...expiredEvents,
  ]
    .sort(
      (left, right) =>
        new Date(right.timestamp).getTime() -
        new Date(left.timestamp).getTime(),
    )
    .slice(0, ADMIN_OVERVIEW_RECENT_ACTIVITY_LIMIT)
}

async function countUnmatchedExpiredListingsThisMonth(now = new Date()) {
  const monthStart = startOfCalendarMonth(now)
  const monthEnd = endOfCalendarMonth(now)

  const listings = await Listing.find({
    status: LISTING_STATUS.EXPIRED,
    expiresAt: { $gte: monthStart, $lt: monthEnd },
  })
    .select('_id')
    .lean<{ _id: mongoose.Types.ObjectId }[]>()

  if (listings.length === 0) return 0

  const matchedIds = await listingIdsWithAcceptedOrCompletedRequest(
    listings.map((listing) => listing._id),
  )

  return listings.filter((listing) => !matchedIds.has(listing._id.toString()))
    .length
}

type StuckHandoverRow = {
  donor?: { organisationName?: string | null } | null
}

async function buildStuckHandoversFlag(now = new Date()): Promise<AdminOverviewFlag | null> {
  const stuckThreshold = new Date(
    now.getTime() - ADMIN_OVERVIEW_STUCK_HANDOVER_HOURS * 60 * 60 * 1000,
  )

  const filter = {
    status: REQUEST_STATUS.ACCEPTED,
    'confirmation.donorConfirmed': true,
    'confirmation.ngoConfirmed': false,
    $or: [
      { 'confirmation.completedAt': { $exists: false } },
      { 'confirmation.completedAt': null },
    ],
    'confirmation.donorConfirmedAt': { $lte: stuckThreshold },
  }

  const [count, sample] = await Promise.all([
    FoodRequest.countDocuments(filter),
    FoodRequest.findOne(filter)
      .select('donor')
      .populate({ path: 'donor', model: User, select: 'organisationName' })
      .lean<StuckHandoverRow>(),
  ])

  if (count === 0) return null

  const donorName = formatOrgName(
    sample?.donor?.organisationName,
    'Platform-wide',
  )

  return {
    type: ADMIN_OVERVIEW_FLAG_TYPE.STUCK_HANDOVERS,
    title: `${count} pickup${count === 1 ? '' : 's'} confirmed by donor but not by NGO`,
    detail: `${donorName} · this month`,
    count,
    reviewPath: ADMIN_OVERVIEW_FLAG_REVIEW_PATH.LISTINGS,
  }
}

async function buildUnmatchedExpiriesFlag(
  now = new Date(),
): Promise<AdminOverviewFlag | null> {
  const count = await countUnmatchedExpiredListingsThisMonth(now)
  if (count === 0) return null

  const monthLabel = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return {
    type: ADMIN_OVERVIEW_FLAG_TYPE.UNMATCHED_EXPIRIES,
    title: `${count} listing${count === 1 ? '' : 's'} expired unmatched this month`,
    detail: `Platform-wide · ${monthLabel}`,
    count,
    reviewPath: ADMIN_OVERVIEW_FLAG_REVIEW_PATH.LISTINGS,
  }
}

async function buildFlags(now = new Date()): Promise<AdminOverviewFlag[]> {
  const [stuckHandovers, unmatchedExpiries] = await Promise.all([
    buildStuckHandoversFlag(now),
    buildUnmatchedExpiriesFlag(now),
  ])

  return [stuckHandovers, unmatchedExpiries]
    .filter((flag): flag is AdminOverviewFlag => flag !== null)
    .slice(0, ADMIN_OVERVIEW_FLAGS_LIMIT)
}

export async function getAdminOverview(now = new Date()): Promise<AdminOverviewData> {
  const thisWeekStart = startOfCalendarWeek(now)
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  const nextWeekStart = new Date(thisWeekStart)
  nextWeekStart.setDate(nextWeekStart.getDate() + 7)

  const [
    pendingVerifications,
    pendingOver48h,
    activeListings,
    transfersThisWeek,
    transfersLastWeek,
    registered,
    recentActivity,
    flags,
  ] = await Promise.all([
    countPendingVerifications(),
    countPendingVerificationsWaitingOverHours(
      ADMIN_OVERVIEW_PENDING_URGENT_HOURS,
      now,
    ),
    countActiveListings(now),
    countCompletedTransfersBetween(thisWeekStart, nextWeekStart),
    countCompletedTransfersBetween(lastWeekStart, thisWeekStart),
    countRegisteredOrganisations(now),
    buildRecentActivity(now),
    buildFlags(now),
  ])

  return {
    stats: {
      pendingVerifications,
      pendingOver48h,
      activeListings,
      transfersThisWeek,
      transfersLastWeekDelta: transfersThisWeek - transfersLastWeek,
      registeredOrganisations: registered.total,
      registeredBreakdown: {
        donors: registered.donors,
        ngos: registered.ngos,
      },
    },
    recentActivity,
    flags,
  }
}
