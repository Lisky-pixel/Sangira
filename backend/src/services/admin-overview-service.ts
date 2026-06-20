import mongoose from 'mongoose'
import {
  LISTING_STATUS,
  REQUEST_STATUS,
  ROLES,
  VERIFICATION_STATUS,
} from '../constants/enums.js'
import {
  ADMIN_OVERVIEW_FLAG_TYPE,
  ADMIN_OVERVIEW_FLAG_REVIEW_PATH,
  ADMIN_OVERVIEW_FLAGS_LIMIT,
  ADMIN_OVERVIEW_PENDING_URGENT_HOURS,
  ADMIN_OVERVIEW_STUCK_HANDOVER_HOURS,
  type AdminOverviewFlagType,
} from '../constants/admin-overview.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'
import {
  buildRecentPlatformActivity,
  type AdminPlatformActivityEvent,
} from './admin-platform-activity-service.js'
import {
  countPendingVerifications,
  countPendingVerificationsWaitingOverHours,
} from './admin-verification-service.js'

export type AdminOverviewActivityEvent = AdminPlatformActivityEvent

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

function formatOrgName(value: string | null | undefined, fallback: string) {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed || fallback
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
    buildRecentPlatformActivity(now),
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
