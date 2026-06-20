import {
  ADMIN_NOTIFICATION_EVENT_KEY,
  type AdminNotificationEventKey,
  type AdminNotificationEventPreferences,
} from '../constants/admin-notification-preferences'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

type UpdateNotificationPreferencesResponse = {
  notificationPrefs: {
    adminEvents: AdminNotificationEventPreferences
  }
}

export const adminNotificationPreferencesService = {
  async updateEventPreference(
    key: AdminNotificationEventKey,
    value: boolean,
  ): Promise<AdminNotificationEventPreferences> {
    const response = await apiClient.patch<
      ApiEnvelope<UpdateNotificationPreferencesResponse>
    >('/auth/me/notification-preferences', {
      adminEvents: { [key]: value },
    })

    const prefs = unwrapApiResponse(response).notificationPrefs
    return prefs.adminEvents ?? {
      [ADMIN_NOTIFICATION_EVENT_KEY.NEW_VERIFICATION_SUBMITTED]: true,
      [ADMIN_NOTIFICATION_EVENT_KEY.VERIFICATION_SLA_BREACH]: true,
      [ADMIN_NOTIFICATION_EVENT_KEY.FLAGGED_ACTIVITY]: true,
      [ADMIN_NOTIFICATION_EVENT_KEY.WEEKLY_SUMMARY_EMAIL]: false,
    }
  },
}
