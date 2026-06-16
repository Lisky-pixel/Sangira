import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export type PasswordResetRequestCodeResponse = {
  message: string
  maskedEmail: string
  resendIn: number
}

export type PasswordResetVerifyResponse = {
  user: unknown
  verificationStatus: string
}

export const passwordResetService = {
  async requestCode(identifier: string): Promise<PasswordResetRequestCodeResponse> {
    const response = await apiClient.post<ApiEnvelope<PasswordResetRequestCodeResponse>>(
      '/auth/password/request-code',
      { identifier },
      { skipAuthRefresh: true },
    )
    return unwrapApiResponse(response)
  },

  async verify(input: {
    identifier: string
    code: string
    newPassword: string
  }): Promise<PasswordResetVerifyResponse> {
    const response = await apiClient.post<ApiEnvelope<PasswordResetVerifyResponse>>(
      '/auth/password/verify',
      input,
      { skipAuthRefresh: true },
    )
    return unwrapApiResponse(response)
  },
}

