import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export type PostListingStep = {
  id: string
  label: string
  completed: boolean
}

type PostListingStepperProps = {
  steps: PostListingStep[]
  activeStepId: string
  onStepClick: (stepId: string) => void
  className?: string
}

export function PostListingStepper({
  steps,
  activeStepId,
  onStepClick,
  className,
}: PostListingStepperProps) {
  return (
    <nav aria-label="Listing form progress" className={className}>
      <ol className="flex items-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const active = step.id === activeStepId
          const stepNumber = index + 1

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className={cn(
                  'group flex min-w-0 flex-1 items-center gap-2 rounded-md text-left transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    active || step.completed
                      ? 'bg-primary text-white'
                      : 'bg-sand text-body',
                  )}
                >
                  {step.completed && !active ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    stepNumber
                  )}
                </span>
                <span
                  className={cn(
                    'truncate text-sm font-medium',
                    active ? 'text-charcoal' : 'text-body',
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'hidden h-px flex-1 sm:block',
                    step.completed ? 'bg-primary' : 'bg-border',
                  )}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
