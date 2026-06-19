import { useCallback, useEffect, useRef, useState } from 'react'
import { NOTIFICATION_DROPDOWN_LIMIT } from '../constants/notifications'
import { notificationService } from '../services/notification-service'
import type { AppNotification } from '../types/notification'

export function useDonorNotifications(enabled: boolean) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  )
  const inFlightRef = useRef(false)

  const fetchNotifications = useCallback(async () => {
    if (!enabled || inFlightRef.current) {
      return
    }

    inFlightRef.current = true
    setLoadState('loading')

    try {
      const result = await notificationService.list(NOTIFICATION_DROPDOWN_LIMIT)
      setNotifications(result.notifications)
      setUnreadCount(result.unreadCount)
      setLoadState('ready')
    } catch {
      setLoadState('error')
    } finally {
      inFlightRef.current = false
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void fetchNotifications()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [enabled, fetchNotifications])

  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead()
    setUnreadCount(0)
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    )
  }, [])

  return {
    notifications,
    unreadCount,
    loadState,
    fetchNotifications,
    markAllRead,
  }
}
