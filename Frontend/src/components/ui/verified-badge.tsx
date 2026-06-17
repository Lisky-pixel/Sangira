import { ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/utils'

type VerifiedBadgeProps = {
  label?: string
  className?: string
}

export function VerifiedBadge({ label, className }: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        'text-verified inline-flex items-center gap-1 text-xs font-medium',
        className,
      )}
    >
      <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" />
      {label ? <span>{label}</span> : null}
    </span>
  )
}
