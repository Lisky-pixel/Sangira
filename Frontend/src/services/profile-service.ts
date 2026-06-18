import type { AuthUser } from '../auth/types'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'
import { PROFILE_FIELD, type ProfileFieldKey } from '../constants/profile'
import { AVATAR_PHOTO_FIELD } from '../constants/avatar-photo'

type ProfilePatchResponse = {
  user: AuthUser
}

export const profileService = {
  async patchField(
    field: ProfileFieldKey,
    value: string,
  ): Promise<AuthUser> {
    const response = await apiClient.patch<ApiEnvelope<ProfilePatchResponse>>(
      '/auth/me/profile',
      { [field]: value },
    )

    return unwrapApiResponse(response).user
  },

  async uploadAvatar(file: File): Promise<AuthUser> {
    const formData = new FormData()
    formData.append(AVATAR_PHOTO_FIELD, file)

    const response = await apiClient.patch<ApiEnvelope<ProfilePatchResponse>>(
      '/auth/me/avatar',
      formData,
    )

    return unwrapApiResponse(response).user
  },
}

export { PROFILE_FIELD }
