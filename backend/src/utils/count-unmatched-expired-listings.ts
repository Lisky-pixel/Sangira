import mongoose from 'mongoose'
import { LISTING_STATUS, REQUEST_STATUS } from '../constants/enums.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'

function startOfCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1)
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

/** Listings that expired this calendar month with no accepted/completed request. */
export async function countUnmatchedExpiredListingsThisMonth(now = new Date()) {
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
