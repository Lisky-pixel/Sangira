import { ArrowLeft } from 'lucide-react'
import { StepPill } from '../../components/ui/step-pill'
import { StepProgress } from '../../components/ui/step-progress'
import { registerWizardContent } from '../../placeholder/register-content'
import { cn } from '../../lib/utils'
import { REGISTRATION_TOTAL_STEPS } from './constants'

type RegistrationStepHeaderProps = {
  currentStep: number
  onBack?: () => void
  className?: string
}

export function RegistrationStepHeader({
  currentStep,
  onBack,
  className,
}: RegistrationStepHeaderProps) {
  const showBack = currentStep > 1 && onBack

  return (
    <div
      className={cn('mb-6 flex items-center justify-between gap-4', className)}
    >
      <div className="min-w-0">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-body hover:text-primary inline-flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {registerWizardContent.backLabel}
          </button>
        ) : (
          <span aria-hidden="true" className="inline-block h-5 w-12" />
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <StepPill step={currentStep} total={REGISTRATION_TOTAL_STEPS} />
        <StepProgress
          current={currentStep}
          total={REGISTRATION_TOTAL_STEPS}
          className="hidden w-20 sm:flex"
        />
      </div>
    </div>
  )
}
