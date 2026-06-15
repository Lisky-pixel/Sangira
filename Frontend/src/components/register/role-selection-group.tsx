import { Check } from 'lucide-react'
import { useCallback, useRef } from 'react'
import {
  REGISTRATION_ROLE_OPTIONS,
  type UserRole,
} from '../../constants/registration-roles'
import { cn } from '../../lib/utils'

type RoleSelectionGroupProps = {
  value: UserRole | null
  onChange: (role: UserRole) => void
  headingId: string
}

export function RoleSelectionGroup({
  value,
  onChange,
  headingId,
}: RoleSelectionGroupProps) {
  const optionRefs = useRef<(HTMLDivElement | null)[]>([])

  const focusOption = useCallback((index: number) => {
    optionRefs.current[index]?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      const lastIndex = REGISTRATION_ROLE_OPTIONS.length - 1

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        onChange(REGISTRATION_ROLE_OPTIONS[index].value)
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        focusOption(index === lastIndex ? 0 : index + 1)
        return
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault()
        focusOption(index === 0 ? lastIndex : index - 1)
      }
    },
    [focusOption, onChange],
  )

  return (
    <div
      role="radiogroup"
      aria-labelledby={headingId}
      className="flex flex-col gap-3"
    >
      {REGISTRATION_ROLE_OPTIONS.map((option, index) => {
        const selected = value === option.value
        const tabIndex = selected || (value === null && index === 0) ? 0 : -1

        return (
          <div
            key={option.value}
            ref={(node) => {
              optionRefs.current[index] = node
            }}
            role="radio"
            aria-checked={selected}
            tabIndex={tabIndex}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 p-4 transition-colors sm:p-5',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              selected
                ? 'border-primary bg-mint-card'
                : 'border-border bg-white hover:border-primary/30',
            )}
          >
            <div className="min-w-0 text-left">
              <p className="text-charcoal font-display font-semibold">
                {option.label}
              </p>
              <p className="text-body mt-1 text-sm leading-relaxed">
                {option.description}
              </p>
            </div>
            <span
              aria-hidden="true"
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                selected
                  ? 'border-primary bg-primary'
                  : 'border-status-neutral bg-white',
              )}
            >
              {selected ? (
                <Check className="size-3.5 text-white" strokeWidth={3} />
              ) : null}
            </span>
          </div>
        )
      })}
    </div>
  )
}
