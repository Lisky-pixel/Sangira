import { cn } from '../../lib/utils'

type SingleSelectPillsProps<T extends string> = {
  name: string
  label: string
  options: readonly T[]
  value: T | undefined
  onChange: (value: T) => void
  getLabel: (value: T) => string
  error?: string
  className?: string
}

export function SingleSelectPills<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
  getLabel,
  error,
  className,
}: SingleSelectPillsProps<T>) {
  return (
    <fieldset className={cn('m-0 min-w-0 border-0 p-0', className)}>
      <legend className="text-charcoal mb-2 block w-full text-sm font-medium">
        {label}
      </legend>
      <div
        role="radiogroup"
        aria-label={label}
        aria-invalid={Boolean(error)}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = value === option
          const inputId = `${name}-${option}`

          return (
            <label
              key={option}
              htmlFor={inputId}
              className={cn(
                'inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-charcoal bg-white hover:border-primary/40',
              )}
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {selected ? (
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-white"
                />
              ) : null}
              {getLabel(option)}
            </label>
          )
        })}
      </div>
      {error ? <p className="text-clay-red text-sm">{error}</p> : null}
    </fieldset>
  )
}
