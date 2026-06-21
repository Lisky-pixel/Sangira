import { useState } from 'react'
import { cn } from '../../lib/utils'
import { termsContent } from '../../placeholder/terms-content'
import { TermsModal } from './terms-modal'

type TermsAgreementFieldProps = {
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function TermsAgreementField({
  name,
  checked,
  onChange,
  className,
}: TermsAgreementFieldProps) {
  const [termsOpen, setTermsOpen] = useState(false)

  return (
    <>
      <label
        htmlFor={name}
        className={cn(
          'text-charcoal flex cursor-pointer items-start gap-3 text-sm leading-relaxed',
          className,
        )}
      >
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="border-border text-primary focus-visible:outline-primary mt-0.5 size-4 shrink-0 rounded border accent-primary"
        />
        <span>
          {termsContent.agreementPrefix}{' '}
          <button
            type="button"
            className="text-primary font-medium hover:underline"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setTermsOpen(true)
            }}
          >
            {termsContent.termsLinkLabel}
          </button>
        </span>
      </label>

      <TermsModal open={termsOpen} onOpenChange={setTermsOpen} />
    </>
  )
}
