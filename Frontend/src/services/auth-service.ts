import type { AccountStatus } from '../constants/account-status'
import type { VerificationStatus } from '../constants/verification-status'
import type { AuthUser } from '../auth/types'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

type MeResponse = {
  user: AuthUser
  verificationStatus: VerificationStatus
  accountStatus: AccountStatus
}

type LoginResponse = {
  user: AuthUser
  verificationStatus: VerificationStatus
}

export const authService = {
  async getMe(): Promise<MeResponse> {
    const response = await apiClient.get<ApiEnvelope<MeResponse>>('/auth/me', {
      skipAuthRefresh: true,
    })

    return unwrapApiResponse(response)
  },

  async login(identifier: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<ApiEnvelope<LoginResponse>>(
      '/auth/login',
      { identifier, password },
      { skipAuthRefresh: true },
    )

    return unwrapApiResponse(response)
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}
