import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { cn } from '../../lib/utils'
import { adminUsersContent } from '../../placeholder/admin-users-content'
import { Button } from '../ui/button'

type AdminUserFlagModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organisationName: string
  submitting: boolean
  onSubmit: (payload: { reason?: string }) => void
}

export function AdminUserFlagModal({
  open,
  onOpenChange,
  organisationName,
  submitting,
  onSubmit,
}: AdminUserFlagModalProps) {
  const [reason, setReason] = useState('')
  const { flagModal } = adminUsersContent

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setReason('')
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = () => {
    onSubmit({
      reason: reason.trim() || undefined,
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-charcoal/40" />
        <Dialog.Content className="border-border fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-charcoal text-lg font-semibold">
            {flagModal.title(organisationName)}
          </Dialog.Title>
          <Dialog.Description className="text-body mt-2 text-sm">
            {flagModal.description}
          </Dialog.Description>

          <div className="mt-6 flex flex-col gap-2">
            <label
              htmlFor="admin-user-flag-reason"
              className="text-body text-xs font-semibold"
            >
              {flagModal.reasonLabel}
            </label>
            <textarea
              id="admin-user-flag-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={flagModal.reasonPlaceholder}
              rows={4}
              className={cn(
                'border-border text-charcoal placeholder:text-body/50 w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              )}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="bg-status-amber hover:bg-status-amber/90 w-full text-white"
            >
              {flagModal.submit}
            </Button>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-body hover:text-charcoal text-sm font-medium"
              >
                {flagModal.cancel}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
