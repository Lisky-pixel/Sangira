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
import { countUnmatchedExpiredListingsThisMonth } from '../utils/count-unmatched-expired-listings.js'
import { getVerificationSlaTargetHours } from './platform-settings-service.js'

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
    pendingOverSlaHours: number
    verificationSlaTargetHours: number
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

  const verificationSlaTargetHours = await getVerificationSlaTargetHours()

  const [
    pendingVerifications,
    pendingOverSlaHours,
    activeListings,
    transfersThisWeek,
    transfersLastWeek,
    registered,
    recentActivity,
    flags,
  ] = await Promise.all([
    countPendingVerifications(),
    countPendingVerificationsWaitingOverHours(
      verificationSlaTargetHours,
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
      pendingOverSlaHours,
      verificationSlaTargetHours,
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
