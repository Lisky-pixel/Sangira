import { MONGO_READ_PREFERENCE_PRIMARY } from '../constants/mongo.js'
import { REQUEST_STATUS, ROLES, VERIFICATION_STATUS } from '../constants/enums.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'

const COMPLETED_REQUEST_FILTER = {
  status: REQUEST_STATUS.COMPLETED,
  'confirmation.completedAt': { $exists: true, $ne: null },
} as const

const READ_PRIMARY = { readPreference: MONGO_READ_PREFERENCE_PRIMARY } as const

export type PlatformImpactTotals = {
  mealsRedistributed: number
  wastePreventedKg: number
  completedTransfers: number
}

/** All-time impact from completed transfers — same basis as donor/admin meals metrics. */
export async function aggregatePlatformImpactTotals(): Promise<PlatformImpactTotals> {
  const [row] = await FoodRequest.aggregate<{
    mealsRedistributed: number
    wastePreventedKg: number
    completedTransfers: number
  }>(
    [
      { $match: COMPLETED_REQUEST_FILTER },
      {
        $group: {
          _id: null,
          mealsRedistributed: {
            $sum: { $ifNull: ['$mealsRedistributed', 0] },
          },
          wastePreventedKg: {
            $sum: { $ifNull: ['$wasteKgPrevented', 0] },
          },
          completedTransfers: { $sum: 1 },
        },
      },
    ],
    READ_PRIMARY,
  )

  return {
    mealsRedistributed: row?.mealsRedistributed ?? 0,
    wastePreventedKg: row?.wastePreventedKg ?? 0,
    completedTransfers: row?.completedTransfers ?? 0,
  }
}

/** Donor + NGO accounts with verification.status = approved (revoked excluded). */
export async function countVerifiedOrganisations(): Promise<number> {
  const [row] = await User.aggregate<{ count: number }>(
    [
      {
        $match: {
          role: { $in: [ROLES.DONOR, ROLES.NGO] },
          'verification.status': VERIFICATION_STATUS.APPROVED,
        },
      },
      { $count: 'count' },
    ],
    READ_PRIMARY,
  )

  return row?.count ?? 0
}
