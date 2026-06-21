import { Listing } from '../models/index.js'
import {
  EXPIRY_SWEEP_INTERVAL_MS,
  EXPIRY_SWEEP_STATUSES,
} from '../constants/listing-expiry.js'
import { LISTING_STATUS } from '../constants/enums.js'
import {
  expirePendingRequestsForExpiredListings,
  expirePendingRequestsForListingIds,
} from '../services/expire-pending-requests-service.js'

export async function expireDueListings(): Promise<number> {
  const now = new Date()
  const dueListings = await Listing.find({
    status: { $in: EXPIRY_SWEEP_STATUSES },
    expiresAt: { $lte: now },
  })
    .select('_id')
    .lean()

  if (dueListings.length === 0) {
    return 0
  }

  const listingIds = dueListings.map((listing) => listing._id.toString())

  await Listing.updateMany(
    { _id: { $in: dueListings.map((listing) => listing._id) } },
    { $set: { status: LISTING_STATUS.EXPIRED } },
  )

  await expirePendingRequestsForListingIds(listingIds)

  return dueListings.length
}

async function runExpirySweep() {
  try {
    const expiredCount = await expireDueListings()
    const reconciledRequests = await expirePendingRequestsForExpiredListings()

    if (expiredCount > 0) {
      console.info(`Listing expiry sweep: marked ${expiredCount} listing(s) expired`)
    }

    if (reconciledRequests > 0) {
      console.info(
        `Listing expiry sweep: resolved ${reconciledRequests} pending request(s) on expired listings`,
      )
    }
  } catch (error) {
    console.error('Listing expiry sweep failed', error)
  }
}

export function startListingExpiryJob(): () => void {
  void runExpirySweep()

  const intervalId = setInterval(() => {
    void runExpirySweep()
  }, EXPIRY_SWEEP_INTERVAL_MS)

  return () => {
    clearInterval(intervalId)
  }
}
