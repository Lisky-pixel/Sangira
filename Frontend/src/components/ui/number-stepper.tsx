import { Minus, Plus } from 'lucide-react'
import { useCallback } from 'react'
import { numberStepperContent } from '../../placeholder/register-content'
import { cn } from '../../lib/utils'

type NumberStepperProps = {
  value: number
  onChange: (value: number) => void
  min: number
  step: number
  unitLabel: string
  label: string
  className?: string
}

export function NumberStepper({
  value,
  onChange,
  min,
  step,
  unitLabel,
  label,
  className,
}: NumberStepperProps) {
  const decrement = useCallback(() => {
    onChange(Math.max(min, value - step))
  }, [min, onChange, step, value])

  const increment = useCallback(() => {
    onChange(value + step)
  }, [onChange, step, value])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-charcoal text-sm font-medium">{label}</span>
      <div
        className="border-border flex items-center justify-between rounded-lg border bg-white"
        role="group"
        aria-label={numberStepperContent.ariaLabel(label, value, unitLabel)}
      >
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label={numberStepperContent.decreaseLabel}
          className="text-charcoal hover:text-primary disabled:text-status-neutral flex size-11 shrink-0 items-center justify-center transition-colors disabled:cursor-not-allowed"
        >
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <p
          className="text-charcoal px-2 text-center text-sm font-medium"
          aria-live="polite"
        >
          {value} {unitLabel}
        </p>
        <button
          type="button"
          onClick={increment}
          aria-label={numberStepperContent.increaseLabel}
          className="text-charcoal hover:text-primary flex size-11 shrink-0 items-center justify-center transition-colors"
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  )
}
