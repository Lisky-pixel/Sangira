import type { GetAdminPendingVerificationCountResult } from '../types/admin-portal'
import type {
  ListVerificationsResult,
  RejectVerificationPayload,
  VerificationDetail,
  VerificationDocumentView,
} from '../types/admin-verification'
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

  async listVerifications(
    page: number,
    pageSize: number,
  ): Promise<ListVerificationsResult> {
    const response = await apiClient.get<ApiEnvelope<ListVerificationsResult>>(
      '/admin/verifications',
      { params: { page, pageSize } },
    )
    return unwrapApiResponse(response)
  },

  async getVerificationDetail(id: string): Promise<VerificationDetail> {
    const response = await apiClient.get<
      ApiEnvelope<{ application: VerificationDetail }>
    >(`/admin/verifications/${id}`)
    const data = unwrapApiResponse(response)
    return data.application
  },

  async getVerificationDocumentView(
    id: string,
  ): Promise<VerificationDocumentView> {
    const response = await apiClient.get<
      ApiEnvelope<VerificationDocumentView>
    >(`/admin/verifications/${id}/document/view`)
    return unwrapApiResponse(response)
  },

  async approveVerification(id: string): Promise<VerificationDetail> {
    const response = await apiClient.post<
      ApiEnvelope<{ application: VerificationDetail }>
    >(`/admin/verifications/${id}/approve`)
    const data = unwrapApiResponse(response)
    return data.application
  },

  async rejectVerification(
    id: string,
    payload: RejectVerificationPayload,
  ): Promise<VerificationDetail> {
    const response = await apiClient.post<
      ApiEnvelope<{ application: VerificationDetail }>
    >(`/admin/verifications/${id}/reject`, payload)
    const data = unwrapApiResponse(response)
    return data.application
  },
}
