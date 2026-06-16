import { Check } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { cn } from '../../lib/utils'

type TextFieldProps = {
  name: string
  label: string
  placeholder?: string
  type?: 'text' | 'email'
  autoComplete?: string
}

export function TextField({
  name,
  label,
  placeholder,
  type = 'text',
  autoComplete,
}: TextFieldProps) {
  const {
    register,
    formState: { errors, dirtyFields },
    watch,
  } = useFormContext()
  const error = errors[name]?.message as string | undefined
  const value = watch(name)
  const showValidCheck =
    Boolean(value) && !errors[name] && Boolean(dirtyFields[name])

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-charcoal text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={cn(
            'border-border text-charcoal placeholder:text-status-neutral w-full rounded-lg border bg-white px-3 py-2.5 text-sm',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            showValidCheck && 'pr-10',
            error && 'border-clay-red',
          )}
          {...register(name)}
        />
        {showValidCheck ? (
          <Check
            aria-hidden="true"
            className="text-stat absolute top-1/2 right-3 size-4 -translate-y-1/2"
          />
        ) : null}
      </div>
      {error ? (
        <p id={`${name}-error`} className="text-clay-red text-sm">
          {error}
        </p>
      ) : null}
    </div>
  )
}
