import type {
  ListNotificationsResult,
  MarkAllNotificationsReadResult,
  MarkNotificationReadResult,
} from '../types/notification'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const notificationService = {
  async list(limit: number): Promise<ListNotificationsResult> {
    const response = await apiClient.get<ApiEnvelope<ListNotificationsResult>>(
      '/notifications',
      { params: { limit } },
    )
    return unwrapApiResponse(response)
  },

  async markAllRead(): Promise<MarkAllNotificationsReadResult> {
    const response = await apiClient.post<
      ApiEnvelope<MarkAllNotificationsReadResult>
    >('/notifications/read-all')
    return unwrapApiResponse(response)
  },

  async markRead(notificationId: string): Promise<MarkNotificationReadResult> {
    const response = await apiClient.post<
      ApiEnvelope<MarkNotificationReadResult>
    >(`/notifications/${notificationId}/read`)
    return unwrapApiResponse(response)
  },
}
