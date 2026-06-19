import type {
  GetDonorActivityResult,
  GetDonorDashboardResult,
  GetDonorImpactResult,
} from '../types/donor-impact'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const impactService = {
  async getDonorImpact(): Promise<GetDonorImpactResult> {
    const response = await apiClient.get<ApiEnvelope<GetDonorImpactResult>>(
      '/impact/donor',
    )
    return unwrapApiResponse(response)
  },
}

export const dashboardService = {
  async getDonorDashboard(): Promise<GetDonorDashboardResult> {
    const response = await apiClient.get<ApiEnvelope<GetDonorDashboardResult>>(
      '/dashboard/donor',
    )
    return unwrapApiResponse(response)
  },

  async getDonorActivity(
    page: number,
    pageSize: number,
  ): Promise<GetDonorActivityResult> {
    const response = await apiClient.get<ApiEnvelope<GetDonorActivityResult>>(
      '/dashboard/donor/activity',
      { params: { page, pageSize } },
    )
    return unwrapApiResponse(response)
  },
}
