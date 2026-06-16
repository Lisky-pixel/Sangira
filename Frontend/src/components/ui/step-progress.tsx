import { cn } from '../../lib/utils'

type StepProgressProps = {
  current: number
  total: number
  className?: string
}

export function StepProgress({ current, total, className }: StepProgressProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('flex items-center gap-1', className)}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cn(
            'h-1.5 flex-1 rounded-full',
            index < current ? 'bg-primary' : 'bg-sand',
          )}
        />
      ))}
    </div>
  )
}
