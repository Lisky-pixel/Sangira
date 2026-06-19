import { useEffect, useRef } from 'react'
import { donorNotificationsContent } from '../../placeholder/donor-notifications-content'
import type { AppNotification } from '../../types/notification'
import { DonorNotificationRow } from './donor-notification-row'

type DonorNotificationsPanelProps = {
  open: boolean
  onClose: () => void
  notifications: AppNotification[]
  loadState: 'idle' | 'loading' | 'ready' | 'error'
  onMarkAllRead: () => Promise<void>
}

export function DonorNotificationsPanel({
  open,
  onClose,
  notifications,
  loadState,
  onMarkAllRead,
}: DonorNotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (panelRef.current && !panelRef.current.contains(target)) {
        const trigger = document.getElementById('donor-notifications-trigger')
        if (trigger?.contains(target)) {
          return
        }
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  const handleMarkAllRead = () => {
    void onMarkAllRead()
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={donorNotificationsContent.panelTitle}
      className="border-border absolute top-[calc(100%+0.5rem)] right-0 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-white shadow-lg sm:w-96"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <h2 className="text-charcoal text-base font-semibold">
          {donorNotificationsContent.panelTitle}
        </h2>
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-primary text-sm font-medium hover:underline"
        >
          {donorNotificationsContent.markAllRead}
        </button>
      </div>

      {loadState === 'loading' ? (
        <p className="text-body px-4 py-6 text-sm sm:px-5">
          {donorNotificationsContent.loading}
        </p>
      ) : loadState === 'error' ? (
        <p className="text-clay-red px-4 py-6 text-sm sm:px-5">
          {donorNotificationsContent.loadError}
        </p>
      ) : notifications.length === 0 ? (
        <p className="text-body px-4 py-6 text-sm sm:px-5">
          {donorNotificationsContent.empty}
        </p>
      ) : (
        <ul className="divide-border max-h-[min(24rem,70vh)] divide-y overflow-y-auto">
          {notifications.map((notification) => (
            <DonorNotificationRow
              key={notification.id}
              notification={notification}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
