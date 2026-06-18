import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export type ChangePasswordResponse = {
  passwordUpdated: boolean
}

export const passwordChangeService = {
  async changePassword(input: {
    currentPassword: string
    newPassword: string
  }): Promise<ChangePasswordResponse> {
    const response = await apiClient.post<ApiEnvelope<ChangePasswordResponse>>(
      '/auth/password/change',
      input,
      { skipAuthRefresh: true },
    )
    return unwrapApiResponse(response)
  },
}
