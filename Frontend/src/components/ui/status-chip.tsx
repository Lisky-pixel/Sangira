import { Check, Clock } from 'lucide-react'
import { cn } from '../../lib/utils'
import { myListingsContent } from '../../placeholder/my-listings-content'
import { approvedVerificationContent } from '../../placeholder/approved-verification-content'
import { pendingVerificationContent } from '../../placeholder/pending-verification-content'
import { rejectedVerificationContent } from '../../placeholder/rejected-verification-content'
import { donorDashboardContent } from '../../placeholder/donor-dashboard-content'

export type StatusChipVariant =
  | 'pending'
  | 'rejected'
  | 'verified'
  | 'active'
  | 'requested'
  | 'awaiting_pickup'
  | 'completed'
  | 'expired'

type StatusChipProps = {
  status: StatusChipVariant
  className?: string
}

const dotVariantStyles = {
  pending: {
    container: 'bg-status-pending-bg text-status-pending-text',
    dot: 'bg-status-pending-dot',
    label: pendingVerificationContent.statusChipLabel,
  },
  rejected: {
    container: 'bg-status-rejected-bg text-status-rejected-text',
    dot: 'bg-status-rejected-dot',
    label: rejectedVerificationContent.statusChipLabel,
  },
  verified: {
    container: 'bg-status-verified-bg text-status-verified-text',
    dot: 'bg-status-verified-dot',
    label: approvedVerificationContent.statusChipLabel,
  },
  active: {
    container: 'bg-status-completed text-status-active',
    dot: 'bg-status-active',
    label: donorDashboardContent.statusChip.active,
  },
  requested: {
    container: 'bg-mint-card text-verified',
    dot: 'bg-verified',
    label: donorDashboardContent.statusChip.requested,
  },
  expired: {
    container: 'bg-sand text-status-neutral',
    dot: 'bg-status-neutral',
    label: myListingsContent.statusChip.expired,
  },
} as const

const iconVariantStyles = {
  awaiting_pickup: {
    container: 'bg-status-amber text-white',
    Icon: Clock,
    label: myListingsContent.statusChip.awaitingPickup,
  },
  completed: {
    container: 'bg-status-completed text-status-active',
    Icon: Check,
    label: myListingsContent.statusChip.completed,
  },
} as const

function isIconVariant(
  status: StatusChipVariant,
): status is keyof typeof iconVariantStyles {
  return status in iconVariantStyles
}

export function StatusChip({ status, className }: StatusChipProps) {
  if (isIconVariant(status)) {
    const styles = iconVariantStyles[status]
    const Icon = styles.Icon

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
          styles.container,
          className,
        )}
      >
        <Icon aria-hidden="true" className="size-3.5 shrink-0" />
        {styles.label}
      </span>
    )
  }

  const styles = dotVariantStyles[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        styles.container,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-1.5 shrink-0 rounded-full', styles.dot)}
      />
      {styles.label}
    </span>
  )
}
