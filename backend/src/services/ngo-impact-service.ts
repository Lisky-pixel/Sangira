import { REQUEST_STATUS } from '../constants/enums.js'
import { MONGO_READ_PREFERENCE_PRIMARY } from '../constants/mongo.js'
import { Request as FoodRequest } from '../models/request.js'

export type NgoImpactTotals = {
  completedPickups: number
  mealsReceived: number
}

export type NgoImpactSummary = {
  totals: NgoImpactTotals
}

export async function aggregateNgoImpact(
  ngoId: string,
): Promise<NgoImpactSummary> {
  const completedRequests = await FoodRequest.find({
    ngo: ngoId,
    status: REQUEST_STATUS.COMPLETED,
  })
    .select('mealsRedistributed')
    .read(MONGO_READ_PREFERENCE_PRIMARY)
    .lean<{ mealsRedistributed?: number | null }[]>()

  let mealsReceived = 0

  for (const request of completedRequests) {
    mealsReceived += request.mealsRedistributed ?? 0
  }

  return {
    totals: {
      completedPickups: completedRequests.length,
      mealsReceived,
    },
  }
}
