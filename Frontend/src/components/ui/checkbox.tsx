import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const inputId = id ?? props.name

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'text-charcoal flex cursor-pointer items-start gap-3 text-sm leading-relaxed',
        className,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        className="border-border text-primary focus-visible:outline-primary mt-0.5 size-4 shrink-0 rounded border accent-primary"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}
