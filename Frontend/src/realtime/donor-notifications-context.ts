import { createContext } from 'react'
import type { AppNotification } from '../types/notification'

export type DonorNotificationsContextValue = {
  notifications: AppNotification[]
  unreadCount: number
  loadState: 'idle' | 'loading' | 'ready' | 'error'
  fetchNotifications: () => Promise<void>
  markAllRead: () => Promise<void>
  markNotificationRead: (notificationId: string) => Promise<void>
}

export const DonorNotificationsContext =
  createContext<DonorNotificationsContextValue | null>(null)
