import {
  NOTIFICATION_EVENT_KEY,
  type NotificationEventKey,
  type NotificationPreferences,
} from '../constants/notification-preferences'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

type UpdateNotificationPreferencesResponse = {
  notificationPrefs: NotificationPreferences
}

export const notificationPreferencesService = {
  async updateEventPreference(
    key: NotificationEventKey,
    value: boolean,
  ): Promise<NotificationPreferences> {
    const response = await apiClient.patch<
      ApiEnvelope<UpdateNotificationPreferencesResponse>
    >('/auth/me/notification-preferences', {
      events: { [key]: value },
    })

    return unwrapApiResponse(response).notificationPrefs
  },
}

export { NOTIFICATION_EVENT_KEY }
