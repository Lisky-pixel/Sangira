import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../auth'
import {
  NOTIFICATION_DROPDOWN_LIMIT,
  NOTIFICATION_SOCKET,
} from '../constants/notifications'
import { toast } from '../lib/toast'
import { donorNotificationsContent } from '../placeholder/donor-notifications-content'
import { notificationService } from '../services/notification-service'
import type { AppNotification, NotificationNewPayload } from '../types/notification'
import { DonorNotificationsContext } from './donor-notifications-context'
import {
  releaseSocketClient,
  retainSocketClient,
} from './socket-client'

function prependNotification(
  current: AppNotification[],
  incoming: AppNotification,
): AppNotification[] {
  if (current.some((notification) => notification.id === incoming.id)) {
    return current
  }

  return [incoming, ...current].slice(0, NOTIFICATION_DROPDOWN_LIMIT)
}

type DonorNotificationsProviderProps = {
  children: ReactNode
}

export function DonorNotificationsProvider({
  children,
}: DonorNotificationsProviderProps) {
  const { state } = useAuth()
  const enabled =
    state.status === 'authed' &&
    (state.user.role === 'donor' || state.user.role === 'ngo')

  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadState, setLoadState] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle')
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

  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead()
    setUnreadCount(0)
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    )
  }, [])

  const markNotificationRead = useCallback(async (notificationId: string) => {
    const result = await notificationService.markRead(notificationId)
    setUnreadCount(result.unreadCount)
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    )
  }, [])

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

  useEffect(() => {
    if (!enabled) {
      return
    }

    const socket = retainSocketClient()

    const handleNotificationNew = (payload: NotificationNewPayload) => {
      if (!payload?.notification?.id) {
        return
      }

      setNotifications((current) =>
        prependNotification(current, payload.notification),
      )
      setUnreadCount(payload.unreadCount)
      setLoadState((current) => (current === 'idle' ? 'ready' : current))

      toast.info(donorNotificationsContent.toastNew(payload.notification.title), {
        id: `notification-${payload.notification.id}`,
      })
    }

    socket.on(NOTIFICATION_SOCKET.EVENT_NEW, handleNotificationNew)

    return () => {
      socket.off(NOTIFICATION_SOCKET.EVENT_NEW, handleNotificationNew)
      releaseSocketClient()
    }
  }, [enabled])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loadState,
      fetchNotifications,
      markAllRead,
      markNotificationRead,
    }),
    [
      fetchNotifications,
      loadState,
      markAllRead,
      markNotificationRead,
      notifications,
      unreadCount,
    ],
  )

  return (
    <DonorNotificationsContext.Provider value={value}>
      {children}
    </DonorNotificationsContext.Provider>
  )
}
