import { Minus, Plus } from 'lucide-react'
import { VERIFICATION_SLA_TARGET_HOURS } from '../../constants/platform-settings'
import { adminSettingsContent } from '../../placeholder/admin-settings-content'
import { cn } from '../../lib/utils'

type AdminSlaStepperProps = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function AdminSlaStepper({
  value,
  onChange,
  disabled = false,
}: AdminSlaStepperProps) {
  const { slaTarget } = adminSettingsContent.platform

  const decrement = () => {
    onChange(
      Math.max(VERIFICATION_SLA_TARGET_HOURS.MIN, value - VERIFICATION_SLA_TARGET_HOURS.STEP),
    )
  }

  const increment = () => {
    onChange(
      Math.min(VERIFICATION_SLA_TARGET_HOURS.MAX, value + VERIFICATION_SLA_TARGET_HOURS.STEP),
    )
  }

  return (
    <div className="border-border flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-charcoal text-sm font-semibold">{slaTarget.label}</p>
        <p className="text-body mt-1 text-sm">{slaTarget.description}</p>
      </div>

      <div
        className={cn(
          'border-border flex items-center gap-2 rounded-lg border bg-white',
          disabled && 'opacity-60',
        )}
        role="group"
        aria-label={`${slaTarget.label}: ${value} ${slaTarget.unit}`}
      >
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= VERIFICATION_SLA_TARGET_HOURS.MIN}
          aria-label="Decrease SLA hours"
          className="text-charcoal hover:text-primary disabled:text-status-neutral flex size-10 items-center justify-center transition-colors disabled:cursor-not-allowed"
        >
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <p className="text-charcoal min-w-24 text-center text-sm font-semibold tabular-nums">
          {value} {slaTarget.unit}
        </p>
        <button
          type="button"
          onClick={increment}
          disabled={disabled || value >= VERIFICATION_SLA_TARGET_HOURS.MAX}
          aria-label="Increase SLA hours"
          className="text-charcoal hover:text-primary disabled:text-status-neutral flex size-10 items-center justify-center transition-colors disabled:cursor-not-allowed"
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  )
}
