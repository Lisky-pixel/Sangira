import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useDonorNotifications } from '../../hooks/use-donor-notifications'
import { donorNotificationsContent } from '../../placeholder/donor-notifications-content'
import { cn } from '../../lib/utils'
import { DonorNotificationsPanel } from './donor-notifications-panel'

export function DonorNotificationsBell() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, loadState, fetchNotifications, markAllRead, markNotificationRead } =
    useDonorNotifications()

  const handleToggle = () => {
    const nextOpen = !open
    setOpen(nextOpen)
    if (nextOpen) {
      void fetchNotifications()
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMarkAllRead = async () => {
    await markAllRead()
  }

  return (
    <div className="relative">
      <button
        id="donor-notifications-trigger"
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={donorNotificationsContent.bellAria(unreadCount)}
        className={cn(
          'text-body hover:text-primary relative rounded-md p-2 transition-colors',
          open && 'text-primary',
        )}
      >
        <Bell aria-hidden="true" className="size-5" />
        {unreadCount > 0 ? (
          <span className="bg-primary absolute top-1 right-1 flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      <DonorNotificationsPanel
        open={open}
        onClose={handleClose}
        notifications={notifications}
        loadState={loadState}
        onMarkAllRead={handleMarkAllRead}
        onMarkNotificationRead={markNotificationRead}
      />
    </div>
  )
}
