import { cn } from '../../lib/utils'
import { pendingVerificationContent } from '../../placeholder/pending-verification-content'

export type StatusChipVariant = 'pending'

type StatusChipProps = {
  status: StatusChipVariant
  className?: string
}

const pendingStyles = {
  container: 'bg-status-pending-bg text-status-pending-text',
  dot: 'bg-status-pending-dot',
} as const

export function StatusChip({ status, className }: StatusChipProps) {
  if (status === 'pending') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
          pendingStyles.container,
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn('size-1.5 shrink-0 rounded-full', pendingStyles.dot)}
        />
        {pendingVerificationContent.statusChipLabel}
      </span>
    )
  }

  return null
}
