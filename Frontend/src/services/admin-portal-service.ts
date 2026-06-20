import type {
  AdminReportsData,
} from '../types/admin-reports'
import type {
  ListAdminListingsParams,
  ListAdminListingsResult,
} from '../types/admin-listings'
import type {
  AdminUserActionResult,
  AdminUserDocumentView,
  AdminUserDetail,
  AdminUserOptionalReasonPayload,
  AdminUserRequiredReasonPayload,
  ListAdminUsersParams,
  ListAdminUsersResult,
} from '../types/admin-users'
import type { GetAdminPendingVerificationCountResult } from '../types/admin-portal'
import type {
  AdminOverviewData,
  ListAdminActivityResult,
} from '../types/admin-overview'
import type {
  ListVerificationsResult,
  RejectVerificationPayload,
  VerificationDecisionResult,
  VerificationDetail,
  VerificationDocumentView,
} from '../types/admin-verification'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const adminPortalService = {
  async getOverview(): Promise<AdminOverviewData> {
    const response = await apiClient.get<ApiEnvelope<AdminOverviewData>>(
      '/admin/overview',
    )
    return unwrapApiResponse(response)
  },

  async getActivity(
    page: number,
    pageSize: number,
  ): Promise<ListAdminActivityResult> {
    const response = await apiClient.get<ApiEnvelope<ListAdminActivityResult>>(
      '/admin/activity',
      { params: { page, pageSize } },
    )
    return unwrapApiResponse(response)
  },

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

  async approveVerification(id: string): Promise<VerificationDecisionResult> {
    const response = await apiClient.post<
      ApiEnvelope<VerificationDecisionResult>
    >(`/admin/verifications/${id}/approve`)
    return unwrapApiResponse(response)
  },

  async rejectVerification(
    id: string,
    payload: RejectVerificationPayload,
  ): Promise<VerificationDecisionResult> {
    const response = await apiClient.post<
      ApiEnvelope<VerificationDecisionResult>
    >(`/admin/verifications/${id}/reject`, payload)
    return unwrapApiResponse(response)
  },

  async listUsers(params: ListAdminUsersParams): Promise<ListAdminUsersResult> {
    const response = await apiClient.get<ApiEnvelope<ListAdminUsersResult>>(
      '/admin/users',
      { params },
    )
    return unwrapApiResponse(response)
  },

  async getUserDetail(id: string): Promise<AdminUserDetail> {
    const response = await apiClient.get<
      ApiEnvelope<{ user: AdminUserDetail }>
    >(`/admin/users/${id}`)
    const data = unwrapApiResponse(response)
    return data.user
  },

  async getUserDocumentView(id: string): Promise<AdminUserDocumentView> {
    const response = await apiClient.get<ApiEnvelope<AdminUserDocumentView>>(
      `/admin/users/${id}/document/view`,
    )
    return unwrapApiResponse(response)
  },

  async flagUser(
    id: string,
    payload: AdminUserOptionalReasonPayload,
  ): Promise<AdminUserActionResult> {
    const response = await apiClient.post<ApiEnvelope<AdminUserActionResult>>(
      `/admin/users/${id}/flag`,
      payload,
    )
    return unwrapApiResponse(response)
  },

  async unflagUser(id: string): Promise<AdminUserActionResult> {
    const response = await apiClient.post<ApiEnvelope<AdminUserActionResult>>(
      `/admin/users/${id}/unflag`,
    )
    return unwrapApiResponse(response)
  },

  async suspendUser(
    id: string,
    payload: AdminUserRequiredReasonPayload,
  ): Promise<AdminUserActionResult> {
    const response = await apiClient.post<ApiEnvelope<AdminUserActionResult>>(
      `/admin/users/${id}/suspend`,
      payload,
    )
    return unwrapApiResponse(response)
  },

  async reactivateUser(id: string): Promise<AdminUserActionResult> {
    const response = await apiClient.post<ApiEnvelope<AdminUserActionResult>>(
      `/admin/users/${id}/reactivate`,
    )
    return unwrapApiResponse(response)
  },

  async revokeUserVerification(
    id: string,
    payload: AdminUserRequiredReasonPayload,
  ): Promise<AdminUserActionResult> {
    const response = await apiClient.post<ApiEnvelope<AdminUserActionResult>>(
      `/admin/users/${id}/revoke-verification`,
      payload,
    )
    return unwrapApiResponse(response)
  },

  async restoreUserVerification(id: string): Promise<AdminUserActionResult> {
    const response = await apiClient.post<ApiEnvelope<AdminUserActionResult>>(
      `/admin/users/${id}/restore-verification`,
    )
    return unwrapApiResponse(response)
  },

  async listListings(
    params: ListAdminListingsParams,
  ): Promise<ListAdminListingsResult> {
    const response = await apiClient.get<ApiEnvelope<ListAdminListingsResult>>(
      '/admin/listings',
      { params },
    )
    return unwrapApiResponse(response)
  },

  async getReports(): Promise<AdminReportsData> {
    const response = await apiClient.get<ApiEnvelope<AdminReportsData>>(
      '/admin/reports',
    )
    return unwrapApiResponse(response)
  },
}
