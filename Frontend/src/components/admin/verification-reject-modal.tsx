import * as Dialog from '@radix-ui/react-dialog'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'
import { adminVerificationContent } from '../../placeholder/admin-verification-content'
import type { VerificationRejectReasonCode } from '../../constants/verification-reject-reasons'
import { Button } from '../ui/button'

type VerificationRejectModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organisationName: string
  submitting: boolean
  onSubmit: (payload: {
    reasonCode: VerificationRejectReasonCode
    details?: string
  }) => void
}

export function VerificationRejectModal({
  open,
  onOpenChange,
  organisationName,
  submitting,
  onSubmit,
}: VerificationRejectModalProps) {
  const [reasonCode, setReasonCode] = useState<VerificationRejectReasonCode | ''>(
    '',
  )
  const [details, setDetails] = useState('')
  const { rejectModal } = adminVerificationContent

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setReasonCode('')
      setDetails('')
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = () => {
    if (!reasonCode) return
    onSubmit({
      reasonCode,
      details: details.trim() || undefined,
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-charcoal/40" />
        <Dialog.Content className="border-border fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-charcoal text-lg font-semibold">
            {rejectModal.title}
          </Dialog.Title>
          <Dialog.Description className="text-body mt-2 text-sm">
            {rejectModal.description(organisationName)}
          </Dialog.Description>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="verification-reject-reason"
                className="text-body text-xs font-semibold"
              >
                {rejectModal.reasonLabel}
              </label>
              <div className="relative">
                <select
                  id="verification-reject-reason"
                  value={reasonCode}
                  onChange={(event) =>
                    setReasonCode(
                      event.target.value as VerificationRejectReasonCode | '',
                    )
                  }
                  className={cn(
                    'border-border text-charcoal w-full appearance-none rounded-lg border bg-white py-2.5 pr-10 pl-3 text-sm',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  )}
                >
                  <option value="">{rejectModal.reasonPlaceholder}</option>
                  {adminVerificationContent.reasonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="text-body pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="verification-reject-details"
                className="text-body text-xs font-semibold"
              >
                {rejectModal.detailsLabel}
              </label>
              <textarea
                id="verification-reject-details"
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder={rejectModal.detailsPlaceholder}
                rows={4}
                className={cn(
                  'border-border text-charcoal placeholder:text-body/50 w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                )}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              disabled={!reasonCode || submitting}
              onClick={handleSubmit}
              className="bg-clay-red hover:bg-clay-red/90 w-full text-white"
            >
              {rejectModal.submit}
            </Button>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-body hover:text-charcoal text-sm font-medium"
              >
                {rejectModal.cancel}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
