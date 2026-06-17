import { useFormContext } from 'react-hook-form'
import { cn } from '../../lib/utils'

type TextAreaFieldProps = {
  name: string
  label: string
  placeholder?: string
  rows?: number
}

export function TextAreaField({
  name,
  label,
  placeholder,
  rows = 4,
}: TextAreaFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-charcoal text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          'border-border text-charcoal placeholder:text-status-neutral w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          error && 'border-clay-red',
        )}
        {...register(name)}
      />
      {error ? (
        <p id={`${name}-error`} className="text-clay-red text-sm">
          {error}
        </p>
      ) : null}
    </div>
  )
}
