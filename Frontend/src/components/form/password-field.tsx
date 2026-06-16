import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { passwordFieldA11y } from '../../placeholder/register-content'
import {
  estimatePasswordStrength,
  type PasswordStrengthScore,
} from '../../lib/password-strength'
import { cn } from '../../lib/utils'

type PasswordFieldProps = {
  name: string
  label: string
  placeholder?: string
  autoComplete?: string
  showStrength?: boolean
}

function StrengthMeter({ score }: { score: PasswordStrengthScore }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              index < score ? 'bg-primary' : 'bg-sand',
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function PasswordField({
  name,
  label,
  placeholder,
  autoComplete = 'new-password',
  showStrength = true,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()
  const error = errors[name]?.message as string | undefined
  const password = watch(name) ?? ''
  const strength = estimatePasswordStrength(password)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-charcoal text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={
            showStrength
              ? `${name}-strength${error ? ` ${name}-error` : ''}`
              : error
                ? `${name}-error`
                : undefined
          }
          className={cn(
            'border-border text-charcoal placeholder:text-status-neutral w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            error && 'border-clay-red',
          )}
          {...register(name)}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="text-body hover:text-charcoal absolute top-1/2 right-3 -translate-y-1/2"
          aria-label={
            visible
              ? passwordFieldA11y.hidePassword
              : passwordFieldA11y.showPassword
          }
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>
      {showStrength ? (
        <div id={`${name}-strength`} className="flex flex-col gap-1.5">
          <StrengthMeter score={strength.score} />
          <p className="text-primary text-xs font-medium">{strength.label}</p>
        </div>
      ) : null}
      {error ? (
        <p id={`${name}-error`} className="text-clay-red text-sm">
          {error}
        </p>
      ) : null}
    </div>
  )
}
