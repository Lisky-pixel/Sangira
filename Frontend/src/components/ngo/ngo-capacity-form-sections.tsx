import { Minus, Plus } from 'lucide-react'
import { TRANSPORT_MODE_VALUES } from '../../constants/transport-mode'
import { cn } from '../../lib/utils'
import { ngoCapacityContent } from '../../placeholder/ngo-capacity-content'
import type { TransportMode } from '../../constants/transport-mode'

type NgoCapacityTransportSectionProps = {
  hasOwnTransport: boolean
  mode?: TransportMode
  onHasOwnTransportChange: (value: boolean) => void
  onModeChange: (mode: TransportMode) => void
}

export function NgoCapacityTransportSection({
  hasOwnTransport,
  mode,
  onHasOwnTransportChange,
  onModeChange,
}: NgoCapacityTransportSectionProps) {
  return (
    <section className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="text-charcoal font-display text-lg font-bold">
            {ngoCapacityContent.transport.sectionLabel}
          </h2>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-charcoal text-sm font-medium">
              {ngoCapacityContent.transport.ownTransportLabel}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={hasOwnTransport}
              aria-label={ngoCapacityContent.transport.ownTransportLabel}
              onClick={() => onHasOwnTransportChange(!hasOwnTransport)}
              className={cn(
                'relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                hasOwnTransport ? 'bg-primary' : 'bg-status-neutral/40',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform',
                  hasOwnTransport ? 'translate-x-5' : 'translate-x-0.5',
                )}
              />
            </button>
          </div>
        </div>

        {hasOwnTransport ? (
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label={ngoCapacityContent.transport.sectionLabel}
          >
            {TRANSPORT_MODE_VALUES.map((transportMode) => {
              const label =
                ngoCapacityContent.transport.modeLabels[transportMode]
              const isSelected = mode === transportMode

              return (
                <button
                  key={transportMode}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={ngoCapacityContent.transport.modeAria(label)}
                  onClick={() => onModeChange(transportMode)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-border text-body bg-white hover:border-primary/40',
                  )}
                >
                  {isSelected ? (
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-white"
                    />
                  ) : null}
                  {label}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

type NgoCapacityDailyStepperProps = {
  value: number
  min: number
  max: number
  step: number
  unitLabel: string
  onChange: (value: number) => void
}

export function NgoCapacityDailyStepper({
  value,
  min,
  max,
  step,
  unitLabel,
  onChange,
}: NgoCapacityDailyStepperProps) {
  const decrement = () => onChange(Math.max(min, value - step))
  const increment = () => onChange(Math.min(max, value + step))

  const handleInputChange = (raw: string) => {
    const parsed = Number.parseInt(raw, 10)
    if (Number.isNaN(parsed)) {
      onChange(min)
      return
    }
    onChange(Math.min(max, Math.max(min, parsed)))
  }

  return (
    <section className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-charcoal font-display mb-5 text-lg font-bold">
        {ngoCapacityContent.dailyCapacity.label}
      </h2>
      <div
        className="border-border flex items-center justify-between rounded-xl border bg-white px-2 py-3 sm:px-4"
        role="group"
        aria-label={ngoCapacityContent.dailyCapacity.label}
      >
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label={ngoCapacityContent.dailyCapacity.decreaseAria}
          className="border-border text-charcoal hover:text-primary disabled:text-status-neutral flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed"
        >
          <Minus aria-hidden="true" className="size-4" />
        </button>

        <div className="flex min-w-0 flex-col items-center px-2 text-center">
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => handleInputChange(event.target.value)}
            aria-label={ngoCapacityContent.dailyCapacity.inputAria}
            className="text-primary font-display w-full max-w-[8rem] border-0 bg-transparent text-center text-3xl font-bold outline-none sm:max-w-none sm:text-4xl"
          />
          <span className="text-body text-sm">{unitLabel}</span>
        </div>

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          aria-label={ngoCapacityContent.dailyCapacity.increaseAria}
          className="border-border text-charcoal hover:text-primary disabled:text-status-neutral flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed"
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
    </section>
  )
}
