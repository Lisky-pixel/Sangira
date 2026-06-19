import type { DonorNotificationType } from '../constants/notifications'

export type AppNotification = {
  id: string
  type: DonorNotificationType | string
  title: string
  body: string
  read: boolean
  createdAt: string
  relatedListing?: string
  relatedRequest?: string
}

export type ListNotificationsResult = {
  notifications: AppNotification[]
  unreadCount: number
}

export type MarkAllNotificationsReadResult = {
  unreadCount: number
}

export type MarkNotificationReadResult = {
  notification: AppNotification
  unreadCount: number
}

export type NotificationNewPayload = {
  notification: AppNotification
  unreadCount: number
}
