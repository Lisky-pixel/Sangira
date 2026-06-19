import {
  DONOR_ACTIVITY_TYPE,
  DONOR_DASHBOARD_ACTIVITY,
  DONOR_IMPACT,
  NEEDS_ACTION_LIMIT,
  type DonorActivityType,
} from '../constants/impact.js'
import {
  LISTING_STATUS,
  REQUEST_STATUS,
} from '../constants/enums.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'
import type { QuantityUnit } from '../constants/listing-form.js'

export type DonorImpactTotals = {
  mealsRedistributed: number
  wasteKgPrevented: number
  itemsRedistributed: number
  completedTransfers: number
  ngosServed: number
}

export type DonorImpactThisMonth = {
  meals: number
  wasteKg: number
  items: number
}

export type DonorImpactMonthlyPoint = {
  monthLabel: string
  meals: number
}

export type DonorImpactSummary = {
  totals: DonorImpactTotals
  thisMonth: DonorImpactThisMonth
  monthlySeries: DonorImpactMonthlyPoint[]
  memberSince: string
}

export type DonorNeedsActionItem = {
  requestId: string
  listingId: string
  listingTitle: string
  requestedAt: string
  ngo: {
    organisationName: string
    verified: boolean
    avatarUrl?: string
  }
}

export type DonorActivityEventPayload = {
  listingTitle?: string
  ngoName?: string
  quantity?: number
  quantityUnit?: QuantityUnit
  mealsRedistributed?: number
  wasteKgPrevented?: number
  itemsRedistributed?: number
}

export type DonorActivityEvent = {
  id: string
  type: DonorActivityType
  timestamp: string
  payload: DonorActivityEventPayload
}

export type DonorNeedsActionSection = {
  items: DonorNeedsActionItem[]
  total: number
}

export type DonorDashboardData = {
  monthlyImpact: {
    thisMonth: DonorImpactThisMonth
    totals: DonorImpactTotals
    monthlySeries: DonorImpactMonthlyPoint[]
  }
  needsAction: DonorNeedsActionSection
  recentActivity: DonorActivityEvent[]
}

type MonthBucket = {
  year: number
  month: number
  monthLabel: string
}

function buildLastMonthBuckets(
  length: number,
  now = new Date(),
): MonthBucket[] {
  const buckets: MonthBucket[] = []

  for (let offset = length - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    buckets.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      monthLabel: date.toLocaleDateString('en-US', { month: 'short' }),
    })
  }

  return buckets
}

function isInCalendarMonth(
  iso: string | Date | null | undefined,
  bucket: MonthBucket,
) {
  if (!iso) {
    return false
  }

  const date = iso instanceof Date ? iso : new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return false
  }

  return date.getFullYear() === bucket.year && date.getMonth() === bucket.month
}

function isCurrentCalendarMonth(
  iso: string | Date | null | undefined,
  now = new Date(),
) {
  if (!iso) {
    return false
  }

  const date = iso instanceof Date ? iso : new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return false
  }

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  )
}

async function loadDonorListingIds(donorId: string): Promise<string[]> {
  const ids = await Listing.find({ donor: donorId }).distinct('_id')
  return ids.map((id) => id.toString())
}

type CompletedRequestRow = {
  _id: { toString(): string }
  ngo: { toString(): string }
  mealsRedistributed?: number | null
  wasteKgPrevented?: number | null
  itemsRedistributed?: number | null
  confirmation?: { completedAt?: Date | null } | null
}

export async function aggregateDonorImpact(
  donorId: string,
): Promise<DonorImpactSummary> {
  const [donor, listingIds] = await Promise.all([
    User.findById(donorId).select('createdAt').lean(),
    loadDonorListingIds(donorId),
  ])

  const completedRequests = listingIds.length
    ? await FoodRequest.find({
        listing: { $in: listingIds },
        status: REQUEST_STATUS.COMPLETED,
      })
        .select(
          'ngo mealsRedistributed wasteKgPrevented itemsRedistributed confirmation.completedAt',
        )
        .lean()
    : []

  const totals: DonorImpactTotals = {
    mealsRedistributed: 0,
    wasteKgPrevented: 0,
    itemsRedistributed: 0,
    completedTransfers: completedRequests.length,
    ngosServed: 0,
  }

  const thisMonth: DonorImpactThisMonth = {
    meals: 0,
    wasteKg: 0,
    items: 0,
  }

  const ngoIds = new Set<string>()
  const monthlyBuckets = buildLastMonthBuckets(DONOR_IMPACT.MONTHLY_SERIES_LENGTH)
  const mealsByBucket = new Map(
    monthlyBuckets.map((bucket) => [
      `${bucket.year}-${bucket.month}`,
      0,
    ]),
  )

  for (const request of completedRequests as CompletedRequestRow[]) {
    const meals = request.mealsRedistributed ?? 0
    const wasteKg = request.wasteKgPrevented ?? 0
    const items = request.itemsRedistributed ?? 0
    const completedAt = request.confirmation?.completedAt

    totals.mealsRedistributed += meals
    totals.wasteKgPrevented += wasteKg
    totals.itemsRedistributed += items
    ngoIds.add(request.ngo.toString())

    if (isCurrentCalendarMonth(completedAt)) {
      thisMonth.meals += meals
      thisMonth.wasteKg += wasteKg
      thisMonth.items += items
    }

    for (const bucket of monthlyBuckets) {
      if (isInCalendarMonth(completedAt, bucket)) {
        const key = `${bucket.year}-${bucket.month}`
        mealsByBucket.set(key, (mealsByBucket.get(key) ?? 0) + meals)
      }
    }
  }

  totals.ngosServed = ngoIds.size

  const monthlySeries = monthlyBuckets.map((bucket) => ({
    monthLabel: bucket.monthLabel,
    meals: mealsByBucket.get(`${bucket.year}-${bucket.month}`) ?? 0,
  }))

  return {
    totals,
    thisMonth,
    monthlySeries,
    memberSince: donor?.createdAt?.toISOString() ?? new Date(0).toISOString(),
  }
}

export async function listDonorNeedsAction(
  donorId: string,
): Promise<DonorNeedsActionSection> {
  const activeListings = await Listing.find({
    donor: donorId,
    status: LISTING_STATUS.ACTIVE,
  })
    .select('_id title')
    .lean()

  if (activeListings.length === 0) {
    return { items: [], total: 0 }
  }

  const listingTitleById = new Map(
    activeListings.map((listing) => [listing._id.toString(), listing.title]),
  )

  const requests = await FoodRequest.find({
    listing: { $in: activeListings.map((listing) => listing._id) },
    status: REQUEST_STATUS.REQUESTED,
  })
    .populate({
      path: 'ngo',
      model: User,
      select: 'organisationName avatarUrl verification.status',
    })
    .sort({ createdAt: -1 })
    .lean()

  const items = requests
    .map((request) => {
      const listingId = request.listing.toString()
      const listingTitle = listingTitleById.get(listingId)
      const ngo = request.ngo as {
        organisationName?: string | null
        avatarUrl?: string | null
        verification?: { status?: string } | null
      }

      if (!listingTitle) {
        return null
      }

      const avatarUrl =
        typeof ngo.avatarUrl === 'string' && ngo.avatarUrl.trim()
          ? ngo.avatarUrl.trim()
          : undefined

      return {
        requestId: request._id.toString(),
        listingId,
        listingTitle,
        requestedAt: request.createdAt.toISOString(),
        ngo: {
          organisationName:
            ngo.organisationName?.trim() || 'Verified organisation',
          verified: ngo.verification?.status === 'approved',
          ...(avatarUrl ? { avatarUrl } : {}),
        },
      }
    })
    .filter((item): item is DonorNeedsActionItem => item !== null)

  return {
    items: items.slice(0, NEEDS_ACTION_LIMIT),
    total: items.length,
  }
}

type ListingActivityRow = {
  _id: { toString(): string }
  title: string
  status: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

type RequestActivityRow = {
  _id: { toString(): string }
  listing: { toString(): string }
  status: string
  createdAt: Date
  updatedAt: Date
  mealsRedistributed?: number | null
  wasteKgPrevented?: number | null
  itemsRedistributed?: number | null
  confirmation?: { completedAt?: Date | null } | null
  ngo?: {
    organisationName?: string | null
  } | null
}

export async function listDonorRecentActivity(
  donorId: string,
): Promise<DonorActivityEvent[]> {
  const events = await buildDonorActivityEvents(donorId, {
    listingLimit: DONOR_DASHBOARD_ACTIVITY.LISTING_LOOKBACK,
    requestLimit: DONOR_DASHBOARD_ACTIVITY.REQUEST_LOOKBACK,
  })

  return events.slice(0, DONOR_DASHBOARD_ACTIVITY.RECENT_LIMIT)
}

async function buildDonorActivityEvents(
  donorId: string,
  options?: { listingLimit?: number; requestLimit?: number },
): Promise<DonorActivityEvent[]> {
  const listingIds = await loadDonorListingIds(donorId)

  if (listingIds.length === 0) {
    return []
  }

  const listingQuery = Listing.find({ donor: donorId })
    .select('title status createdAt updatedAt expiresAt')
    .sort({ updatedAt: -1 })

  if (options?.listingLimit) {
    listingQuery.limit(options.listingLimit)
  }

  const requestQuery = FoodRequest.find({ listing: { $in: listingIds } })
    .populate({
      path: 'ngo',
      model: User,
      select: 'organisationName',
    })
    .select(
      'listing status createdAt updatedAt mealsRedistributed wasteKgPrevented itemsRedistributed confirmation.completedAt',
    )
    .sort({ updatedAt: -1 })

  if (options?.requestLimit) {
    requestQuery.limit(options.requestLimit)
  }

  const [listings, requests] = await Promise.all([
    listingQuery.lean(),
    requestQuery.lean(),
  ])

  const listingTitleById = new Map(
    listings.map((listing) => [listing._id.toString(), listing.title]),
  )

  const events: DonorActivityEvent[] = []

  for (const listing of listings as ListingActivityRow[]) {
    const listingId = listing._id.toString()

    events.push({
      id: `listing-posted-${listingId}`,
      type: DONOR_ACTIVITY_TYPE.LISTING_POSTED,
      timestamp: listing.createdAt.toISOString(),
      payload: { listingTitle: listing.title },
    })

    if (listing.status === LISTING_STATUS.EXPIRED) {
      events.push({
        id: `listing-expired-${listingId}`,
        type: DONOR_ACTIVITY_TYPE.LISTING_EXPIRED,
        timestamp: listing.expiresAt.toISOString(),
        payload: { listingTitle: listing.title },
      })
    }
  }

  for (const request of requests as RequestActivityRow[]) {
    const requestId = request._id.toString()
    const listingTitle =
      listingTitleById.get(request.listing.toString()) ?? 'your listing'
    const ngoName = request.ngo?.organisationName?.trim() || 'An NGO'

    events.push({
      id: `request-received-${requestId}`,
      type: DONOR_ACTIVITY_TYPE.REQUEST_RECEIVED,
      timestamp: request.createdAt.toISOString(),
      payload: { listingTitle, ngoName },
    })

    if (
      request.status === REQUEST_STATUS.ACCEPTED ||
      request.status === REQUEST_STATUS.COMPLETED
    ) {
      events.push({
        id: `request-accepted-${requestId}`,
        type: DONOR_ACTIVITY_TYPE.REQUEST_ACCEPTED,
        timestamp: request.updatedAt.toISOString(),
        payload: { listingTitle, ngoName },
      })
    }

    if (
      request.status === REQUEST_STATUS.COMPLETED &&
      request.confirmation?.completedAt
    ) {
      events.push({
        id: `transfer-completed-${requestId}`,
        type: DONOR_ACTIVITY_TYPE.TRANSFER_COMPLETED,
        timestamp: request.confirmation.completedAt.toISOString(),
        payload: {
          listingTitle,
          ngoName,
          mealsRedistributed: request.mealsRedistributed ?? 0,
          wasteKgPrevented: request.wasteKgPrevented ?? 0,
          itemsRedistributed: request.itemsRedistributed ?? 0,
        },
      })
    }
  }

  return events.sort(
    (left, right) =>
      new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  )
}

function paginateActivityEvents(
  events: DonorActivityEvent[],
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

export async function listDonorActivityPaginated(
  donorId: string,
  input: { page: number; pageSize: number },
) {
  const events = await buildDonorActivityEvents(donorId)
  return paginateActivityEvents(events, input.page, input.pageSize)
}

export async function getDonorDashboard(
  donorId: string,
): Promise<DonorDashboardData> {
  const [impact, needsAction, recentActivity] = await Promise.all([
    aggregateDonorImpact(donorId),
    listDonorNeedsAction(donorId),
    listDonorRecentActivity(donorId),
  ])

  return {
    monthlyImpact: {
      thisMonth: impact.thisMonth,
      totals: impact.totals,
      monthlySeries: impact.monthlySeries,
    },
    needsAction,
    recentActivity,
  }
}
