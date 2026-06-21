import { LISTING_STATUS, REQUEST_STATUS } from '../constants/enums.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { isListingExpiredByTime } from '../utils/resolve-effective-listing-status.js'

function expiredListingFilter(now: Date) {
  return {
    $or: [
      { status: LISTING_STATUS.EXPIRED },
      {
        status: LISTING_STATUS.ACTIVE,
        expiresAt: { $lte: now },
      },
    ],
  }
}

/** Mark still-requested NGO requests terminal when their listing has expired. Idempotent. */
export async function expirePendingRequestsForExpiredListings(
  now = new Date(),
): Promise<number> {
  const expiredListingIds = await Listing.find(expiredListingFilter(now))
    .select('_id')
    .lean()

  if (expiredListingIds.length === 0) {
    return 0
  }

  const result = await FoodRequest.updateMany(
    {
      listing: { $in: expiredListingIds.map((listing) => listing._id) },
      status: REQUEST_STATUS.REQUESTED,
    },
    { $set: { status: REQUEST_STATUS.EXPIRED } },
  )

  return result.modifiedCount
}

export async function expirePendingRequestsForListingIds(
  listingIds: readonly string[],
): Promise<number> {
  if (listingIds.length === 0) {
    return 0
  }

  const result = await FoodRequest.updateMany(
    {
      listing: { $in: listingIds },
      status: REQUEST_STATUS.REQUESTED,
    },
    { $set: { status: REQUEST_STATUS.EXPIRED } },
  )

  return result.modifiedCount
}

/** Read-side safety net — resolve stuck pending requests for one NGO before listing. */
export async function reconcileExpiredPendingRequestsForNgo(
  ngoId: string,
  now = new Date(),
): Promise<number> {
  const pendingRequests = await FoodRequest.find({
    ngo: ngoId,
    status: REQUEST_STATUS.REQUESTED,
  })
    .select('listing')
    .lean()

  if (pendingRequests.length === 0) {
    return 0
  }

  const listingIds = [
    ...new Set(pendingRequests.map((request) => request.listing.toString())),
  ]

  const expiredListings = await Listing.find({
    _id: { $in: listingIds },
    ...expiredListingFilter(now),
  })
    .select('_id expiresAt status')
    .lean()

  const expiredListingIdSet = new Set(
    expiredListings
      .filter(
        (listing) =>
          listing.status === LISTING_STATUS.EXPIRED ||
          isListingExpiredByTime(listing.expiresAt, now),
      )
      .map((listing) => listing._id.toString()),
  )

  if (expiredListingIdSet.size === 0) {
    return 0
  }

  const result = await FoodRequest.updateMany(
    {
      ngo: ngoId,
      listing: { $in: [...expiredListingIdSet] },
      status: REQUEST_STATUS.REQUESTED,
    },
    { $set: { status: REQUEST_STATUS.EXPIRED } },
  )

  return result.modifiedCount
}
