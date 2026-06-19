import type { GetNgoDashboardResult } from '../types/ngo-dashboard'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const ngoDashboardService = {
  async getNgoDashboard(): Promise<GetNgoDashboardResult> {
    const response = await apiClient.get<ApiEnvelope<GetNgoDashboardResult>>(
      '/dashboard/ngo',
    )
    return unwrapApiResponse(response)
  },
}
