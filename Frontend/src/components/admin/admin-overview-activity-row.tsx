import {
  BadgeCheck,
  ClipboardList,
  PackagePlus,
  UserPlus,
  XCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ADMIN_OVERVIEW_ACTIVITY_TYPE } from '../../constants/admin-overview'
import { getAdminOverviewActivityLabel } from '../../lib/format-admin-overview-activity'
import { formatRelativeTime } from '../../lib/relative-time'
import { cn } from '../../lib/utils'
import { adminOverviewContent } from '../../placeholder/admin-overview-content'
import type {
  AdminOverviewActivityEvent,
  AdminOverviewActivityType,
} from '../../types/admin-overview'

type ActivityIconConfig = {
  icon: LucideIcon
  className: string
}

function activityIconConfig(
  type: AdminOverviewActivityType,
): ActivityIconConfig {
  switch (type) {
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.VERIFICATION_APPROVED:
      return {
        icon: BadgeCheck,
        className: 'bg-blue-100 text-blue-700',
      }
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.VERIFICATION_REJECTED:
      return {
        icon: XCircle,
        className: 'bg-red-100 text-clay-red',
      }
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.LISTING_POSTED:
      return {
        icon: PackagePlus,
        className: 'bg-mint-card text-verified',
      }
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.TRANSFER_COMPLETED:
      return {
        icon: ClipboardList,
        className: 'bg-emerald-100 text-emerald-700',
      }
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.REGISTRATION_PENDING:
      return {
        icon: UserPlus,
        className: 'bg-amber-100 text-amber-800',
      }
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.LISTING_EXPIRED_UNMATCHED:
      return {
        icon: XCircle,
        className: 'bg-red-100 text-clay-red',
      }
    default:
      return {
        icon: ClipboardList,
        className: 'bg-sand text-body',
      }
  }
}

type AdminOverviewActivityRowProps = {
  event: AdminOverviewActivityEvent
}

export function AdminOverviewActivityRow({ event }: AdminOverviewActivityRowProps) {
  const label = getAdminOverviewActivityLabel(event.type)
  const { icon: Icon, className } = activityIconConfig(event.type)

  return (
    <li className="flex min-h-[4.5rem] min-w-0 items-center gap-3 py-4 sm:gap-4">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-9 shrink-0 items-center justify-center self-center rounded-full',
          className,
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-charcoal text-sm font-semibold leading-snug">
          {label}
        </p>
        <p className="text-body mt-1 text-sm leading-snug break-words">
          {event.subject}
          {event.awaitingReview ? (
            <>
              {', '}
              <span className="text-status-pending-text font-medium">
                {adminOverviewContent.activity.awaitingReview}
              </span>
            </>
          ) : null}
          {' · '}
          <time dateTime={event.timestamp} className="whitespace-nowrap">
            {formatRelativeTime(event.timestamp)}
          </time>
        </p>
      </div>
    </li>
  )
}
