import { cn } from '../../lib/utils'

type HeaderZigzagBorderProps = {
  className?: string
}

export function HeaderZigzagBorder({ className }: HeaderZigzagBorderProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none h-3 w-full', className)}
    >
      <svg
        className="text-primary h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 120 12"
      >
        <path
          d="M0 12 L10 0 L20 12 L30 0 L40 12 L50 0 L60 12 L70 0 L80 12 L90 0 L100 12 L110 0 L120 12 L120 12 L0 12 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
