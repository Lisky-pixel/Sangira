import { Building2, Check, Package, type LucideIcon } from 'lucide-react'
import {
  DONOR_NOTIFICATION_TYPE,
  NGO_NOTIFICATION_TYPE,
} from '../../constants/notifications'
import { formatRelativeTime } from '../../lib/relative-time'
import { cn } from '../../lib/utils'
import type { AppNotification } from '../../types/notification'

type DonorNotificationRowProps = {
  notification: AppNotification
  href?: string | null
  onActivate?: () => void
}

const NOTIFICATION_ICONS: Record<string, LucideIcon> = {
  [DONOR_NOTIFICATION_TYPE.REQUEST_RECEIVED]: Building2,
  [DONOR_NOTIFICATION_TYPE.REQUEST_ACCEPTED]: Check,
  [DONOR_NOTIFICATION_TYPE.TRANSFER_COMPLETE]: Check,
  [NGO_NOTIFICATION_TYPE.NEW_LISTING]: Package,
}

export function DonorNotificationRow({
  notification,
  href,
  onActivate,
}: DonorNotificationRowProps) {
  const Icon = NOTIFICATION_ICONS[notification.type] ?? Check
  const relativeTime = formatRelativeTime(notification.createdAt)
  const isInteractive = Boolean(href && onActivate)

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          notification.read
            ? 'bg-sand text-body/50'
            : 'bg-primary text-white',
        )}
      >
        <Icon className="size-4" strokeWidth={2.25} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-primary text-sm font-semibold">
            {notification.title}
          </p>
          <time
            dateTime={notification.createdAt}
            className="text-body shrink-0 text-xs whitespace-nowrap"
          >
            {relativeTime}
          </time>
        </div>
        <p className="text-body mt-1 text-sm leading-relaxed">
          {notification.body}
        </p>
      </div>

      {!notification.read ? (
        <span
          aria-hidden="true"
          className="bg-primary mt-2 size-2 shrink-0 rounded-full"
        />
      ) : (
        <span aria-hidden="true" className="mt-2 size-2 shrink-0" />
      )}
    </>
  )

  if (isInteractive) {
    return (
      <li>
        <button
          type="button"
          onClick={onActivate}
          className={cn(
            'hover:bg-mint-card/40 flex w-full items-start gap-3 px-4 py-3 text-left transition-colors sm:gap-4 sm:px-5',
            !notification.read && 'bg-mint-card/60',
          )}
        >
          {content}
        </button>
      </li>
    )
  }

  return (
    <li
      className={cn(
        'flex items-start gap-3 px-4 py-3 sm:gap-4 sm:px-5',
        !notification.read && 'bg-mint-card/60',
      )}
    >
      {content}
    </li>
  )
}
