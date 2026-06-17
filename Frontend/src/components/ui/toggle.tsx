import { cn } from '../../lib/utils'

type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  className?: string
  id?: string
  disabled?: boolean
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  className,
  id,
  disabled = false,
}: ToggleProps) {
  const switchId = id ?? label.replace(/\s+/g, '-').toLowerCase()

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <span
          id={`${switchId}-label`}
          className={cn(
            'text-charcoal text-sm',
            description ? 'font-semibold' : 'font-medium',
          )}
        >
          {label}
        </span>
        {description ? (
          <p className="text-body mt-0.5 text-sm">{description}</p>
        ) : null}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${switchId}-label`}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        onKeyDown={(event) => {
          if (disabled) return
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault()
            onChange(!checked)
          }
        }}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          checked ? 'bg-primary' : 'bg-status-neutral/40',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}
