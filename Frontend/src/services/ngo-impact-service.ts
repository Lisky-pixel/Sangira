import type { GetNgoImpactResult } from '../types/ngo-impact'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const ngoImpactService = {
  async getNgoImpact(): Promise<GetNgoImpactResult> {
    const response = await apiClient.get<ApiEnvelope<GetNgoImpactResult>>(
      '/impact/ngo',
    )
    return unwrapApiResponse(response)
  },
}
