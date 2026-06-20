import type { AdminMeData, AdminSettingsData } from '../types/admin-profile'
import type { AdminProfileFieldKey } from '../constants/admin-profile'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const adminProfileService = {
  async getMe(): Promise<AdminMeData> {
    const response = await apiClient.get<ApiEnvelope<AdminMeData>>('/admin/me')
    return unwrapApiResponse(response)
  },

  async patchField(
    field: AdminProfileFieldKey,
    value: string,
  ): Promise<AdminMeData['profile']> {
    const response = await apiClient.patch<
      ApiEnvelope<{ profile: AdminMeData['profile'] }>
    >('/admin/me/profile', { [field]: value })
    return unwrapApiResponse(response).profile
  },
}

export const adminSettingsService = {
  async getSettings(): Promise<AdminSettingsData> {
    const response = await apiClient.get<ApiEnvelope<AdminSettingsData>>(
      '/admin/settings',
    )
    return unwrapApiResponse(response)
  },

  async updateVerificationSlaTargetHours(
    verificationSlaTargetHours: number,
  ): Promise<number> {
    const response = await apiClient.patch<
      ApiEnvelope<{ verificationSlaTargetHours: number }>
    >('/admin/settings/platform', { verificationSlaTargetHours })
    return unwrapApiResponse(response).verificationSlaTargetHours
  },
}
