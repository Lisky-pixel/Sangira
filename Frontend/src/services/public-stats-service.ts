import { PUBLIC_STATS_API_PATH } from '../constants/public-stats'
import type { GetPublicStatsResult } from '../types/public-stats'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const publicStatsService = {
  async getPublicStats(): Promise<GetPublicStatsResult> {
    const response = await apiClient.get<ApiEnvelope<GetPublicStatsResult>>(
      PUBLIC_STATS_API_PATH,
      { skipAuthRefresh: true },
    )
    return unwrapApiResponse(response)
  },
}
