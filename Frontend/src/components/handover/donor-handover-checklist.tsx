import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

type DonorHandoverChecklistProps = {
  foodReady: boolean
  ngoArrived: boolean
  onFoodReadyChange: (checked: boolean) => void
  onNgoArrivedChange: (checked: boolean) => void
  foodReadyLabel: string
  ngoArrivedLabel: string
  disabled?: boolean
}

function ChecklistItem({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 text-sm',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden="true"
        className={cn(
          'border-border inline-flex size-5 shrink-0 items-center justify-center rounded border bg-white transition-colors',
          checked && 'border-primary bg-primary text-white',
        )}
      >
        {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
      <span className="text-charcoal">{label}</span>
    </label>
  )
}

export function DonorHandoverChecklist({
  foodReady,
  ngoArrived,
  onFoodReadyChange,
  onNgoArrivedChange,
  foodReadyLabel,
  ngoArrivedLabel,
  disabled,
}: DonorHandoverChecklistProps) {
  return (
    <div className="flex flex-col gap-3">
      <ChecklistItem
        checked={foodReady}
        onChange={onFoodReadyChange}
        label={foodReadyLabel}
        disabled={disabled}
      />
      <ChecklistItem
        checked={ngoArrived}
        onChange={onNgoArrivedChange}
        label={ngoArrivedLabel}
        disabled={disabled}
      />
    </div>
  )
}
