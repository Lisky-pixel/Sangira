import { cn } from '../../lib/utils'
import { approvedVerificationContent } from '../../placeholder/approved-verification-content'
import { donorDashboardContent } from '../../placeholder/donor-dashboard-content'
import { pendingVerificationContent } from '../../placeholder/pending-verification-content'
import { rejectedVerificationContent } from '../../placeholder/rejected-verification-content'

export type StatusChipVariant =
  | 'pending'
  | 'rejected'
  | 'verified'
  | 'active'
  | 'requested'

type StatusChipProps = {
  status: StatusChipVariant
  className?: string
}

const variantStyles = {
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
} as const

export function StatusChip({ status, className }: StatusChipProps) {
  const styles = variantStyles[status]

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
