import { cn } from '../../lib/utils'
import { registerWizardContent } from '../../placeholder/register-content'

type StepPillProps = {
  step: number
  total: number
  className?: string
}

export function StepPill({ step, total, className }: StepPillProps) {
  return (
    <span
      className={cn(
        'bg-mint-card text-primary inline-flex rounded-full px-3 py-1 text-xs font-medium sm:text-sm',
        className,
      )}
    >
      {registerWizardContent.stepOfTotal(step, total)}
    </span>
  )
}
