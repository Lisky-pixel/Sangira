import { useEffect, useMemo, useRef } from 'react'
import { cn } from '../../lib/utils'

type OtpInputProps = {
  length: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  inputClassName?: string
  label?: string
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function clampIndex(index: number, length: number) {
  return Math.max(0, Math.min(length - 1, index))
}

export function OtpInput({
  length,
  value,
  onChange,
  disabled,
  className,
  inputClassName,
  label,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const digits = useMemo(() => {
    const cleaned = onlyDigits(value).slice(0, length)
    return Array.from({ length }, (_, i) => cleaned[i] ?? '')
  }, [length, value])

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length)
  }, [length])

  const setAt = (index: number, digit: string) => {
    const next = digits.slice()
    next[index] = digit
    onChange(next.join(''))
  }

  const focusIndex = (index: number) => {
    const i = clampIndex(index, length)
    inputsRef.current[i]?.focus()
    inputsRef.current[i]?.select()
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = onlyDigits(event.clipboardData.getData('text')).slice(0, length)
    if (!pasted) return
    onChange(pasted.padEnd(length, '').slice(0, length))
    const nextIndex = Math.min(pasted.length, length - 1)
    focusIndex(nextIndex)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <div className="text-charcoal text-sm font-medium">{label}</div>
      ) : null}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              inputsRef.current[index] = node
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            onPaste={handlePaste}
            onChange={(event) => {
              const nextDigit = onlyDigits(event.target.value).slice(-1)
              if (!nextDigit) {
                setAt(index, '')
                return
              }
              setAt(index, nextDigit)
              if (index < length - 1) {
                focusIndex(index + 1)
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Backspace') {
                if (digit) {
                  setAt(index, '')
                  return
                }
                if (index > 0) {
                  focusIndex(index - 1)
                  setAt(index - 1, '')
                }
                return
              }

              if (event.key === 'ArrowLeft') {
                event.preventDefault()
                focusIndex(index - 1)
                return
              }

              if (event.key === 'ArrowRight') {
                event.preventDefault()
                focusIndex(index + 1)
                return
              }
            }}
            className={cn(
              'border-border text-charcoal h-12 w-10 rounded-lg border bg-white text-center text-lg font-semibold shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-cream',
              'sm:h-12 sm:w-12',
              inputClassName,
            )}
          />
        ))}
      </div>
    </div>
  )
}

