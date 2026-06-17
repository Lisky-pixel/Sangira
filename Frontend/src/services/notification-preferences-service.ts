import {
  NOTIFICATION_PREF_KEY,
  type NotificationPrefKey,
  type NotificationPreferences,
} from '../constants/notification-preferences'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

type UpdateNotificationPreferencesResponse = {
  notificationPrefs: NotificationPreferences
}

export const notificationPreferencesService = {
  async updatePreference(
    key: NotificationPrefKey,
    value: boolean,
  ): Promise<NotificationPreferences> {
    const response = await apiClient.patch<
      ApiEnvelope<UpdateNotificationPreferencesResponse>
    >('/auth/me/notification-preferences', { [key]: value })

    return unwrapApiResponse(response).notificationPrefs
  },
}

export { NOTIFICATION_PREF_KEY }
