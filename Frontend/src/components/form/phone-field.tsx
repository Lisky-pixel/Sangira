import { Controller, useFormContext } from 'react-hook-form'
import {
  COUNTRY_CODE,
  normalizePhoneDigits,
} from '../../constants/phone'
import { cn } from '../../lib/utils'

type PhoneFieldProps = {
  name: string
  label: string
  helperText: string
  placeholder?: string
}

export function PhoneField({
  name,
  label,
  helperText,
  placeholder,
}: PhoneFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-charcoal text-sm font-medium">
        {label}
      </label>
      <div className="flex overflow-hidden rounded-lg border border-border focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
        <span className="bg-sand text-charcoal border-border flex items-center border-r px-3 py-2.5 text-sm font-medium">
          {COUNTRY_CODE}
        </span>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              id={name}
              type="tel"
              inputMode="numeric"
              placeholder={placeholder}
              autoComplete="tel-national"
              aria-invalid={Boolean(error)}
              aria-describedby={
                error ? `${name}-error ${name}-helper` : `${name}-helper`
              }
              className={cn(
                'text-charcoal placeholder:text-status-neutral min-w-0 flex-1 bg-white px-3 py-2.5 text-sm',
                'focus:outline-none',
                error && 'text-clay-red',
              )}
              value={field.value}
              onChange={(event) => {
                field.onChange(normalizePhoneDigits(event.target.value))
              }}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />
      </div>
      <p id={`${name}-helper`} className="text-body text-sm italic">
        {helperText}
      </p>
      {error ? (
        <p id={`${name}-error`} className="text-clay-red text-sm">
          {error}
        </p>
      ) : null}
    </div>
  )
}
