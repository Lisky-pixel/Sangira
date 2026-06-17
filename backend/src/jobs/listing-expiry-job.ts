import { Listing } from '../models/index.js'
import {
  EXPIRY_SWEEP_INTERVAL_MS,
  EXPIRY_SWEEP_STATUSES,
} from '../constants/listing-expiry.js'
import { LISTING_STATUS } from '../constants/enums.js'

export async function expireDueListings(): Promise<number> {
  const result = await Listing.updateMany(
    {
      status: { $in: EXPIRY_SWEEP_STATUSES },
      expiresAt: { $lte: new Date() },
    },
    { $set: { status: LISTING_STATUS.EXPIRED } },
  )

  return result.modifiedCount
}

async function runExpirySweep() {
  try {
    const expiredCount = await expireDueListings()
    if (expiredCount > 0) {
      console.info(`Listing expiry sweep: marked ${expiredCount} listing(s) expired`)
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
