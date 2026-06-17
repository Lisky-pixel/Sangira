import { cn } from '../../lib/utils'
import { isPastListingExpiry } from '../../lib/listing-expiry'
import { donorDashboardContent } from '../../placeholder/donor-dashboard-content'

type CountdownTone = 'green' | 'amber' | 'red' | 'neutral'

type CountdownChipProps = {
  expiresAt: string
  className?: string
}

function getRemainingMs(expiresAt: string, now = Date.now()) {
  const expires = new Date(expiresAt).getTime()
  if (Number.isNaN(expires)) return 0
  return expires - now
}

function getTone(remainingMs: number): CountdownTone {
  if (remainingMs <= 0) return 'neutral'
  const hours = remainingMs / (60 * 60 * 1000)
  if (hours > 4) return 'green'
  if (hours >= 1) return 'amber'
  return 'red'
}

const toneStyles: Record<CountdownTone, { container: string; dot: string }> = {
  green: {
    container: 'bg-status-completed text-status-active',
    dot: 'bg-status-active',
  },
  amber: {
    container: 'bg-status-pending-bg text-status-pending-text',
    dot: 'bg-status-amber',
  },
  red: {
    container: 'bg-status-rejected-bg text-status-rejected-text',
    dot: 'bg-status-urgent',
  },
  neutral: {
    container: 'bg-sand text-status-neutral',
    dot: 'bg-status-neutral',
  },
}

export function CountdownChip({ expiresAt, className }: CountdownChipProps) {
  const remainingMs = getRemainingMs(expiresAt)

  if (remainingMs <= 0 || isPastListingExpiry(expiresAt)) {
    return null
  }

  const tone = getTone(remainingMs)
  const styles = toneStyles[tone]

  const totalMinutes = Math.floor(remainingMs / (60 * 1000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const label = donorDashboardContent.countdownChip.expiresIn(hours, minutes)

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
      {label}
    </span>
  )
}
