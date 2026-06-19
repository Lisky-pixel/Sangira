import type { GetAdminPendingVerificationCountResult } from '../types/admin-portal'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const adminPortalService = {
  async getPendingVerificationCount(): Promise<number> {
    const response = await apiClient.get<
      ApiEnvelope<GetAdminPendingVerificationCountResult>
    >('/admin/verifications/pending-count')
    const data = unwrapApiResponse(response)
    return data.count
  },
}
