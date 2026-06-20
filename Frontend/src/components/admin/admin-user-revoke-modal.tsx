import * as Dialog from '@radix-ui/react-dialog'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'
import { adminUsersContent } from '../../placeholder/admin-users-content'
import { Button } from '../ui/button'

type AdminUserRevokeModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organisationName: string
  submitting: boolean
  onSubmit: (payload: { reason: string }) => void
}

export function AdminUserRevokeModal({
  open,
  onOpenChange,
  organisationName,
  submitting,
  onSubmit,
}: AdminUserRevokeModalProps) {
  const [reason, setReason] = useState('')
  const { revokeModal } = adminUsersContent

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setReason('')
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = () => {
    const trimmed = reason.trim()
    if (!trimmed) return
    onSubmit({ reason: trimmed })
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-charcoal/40" />
        <Dialog.Content className="border-border fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-charcoal text-lg font-semibold">
            {revokeModal.title(organisationName)}
          </Dialog.Title>
          <Dialog.Description className="text-body mt-2 text-sm">
            {revokeModal.description}
          </Dialog.Description>

          <div className="bg-status-rejected-bg mt-4 flex items-start gap-3 rounded-lg p-4">
            <AlertTriangle
              aria-hidden="true"
              className="text-status-rejected-text mt-0.5 size-4 shrink-0"
            />
            <p className="text-status-rejected-text text-sm leading-relaxed">
              {revokeModal.warning}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <label
              htmlFor="admin-user-revoke-reason"
              className="text-body text-xs font-semibold"
            >
              {revokeModal.reasonLabel}
            </label>
            <textarea
              id="admin-user-revoke-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={revokeModal.reasonPlaceholder}
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
              disabled={!reason.trim() || submitting}
              onClick={handleSubmit}
              className="bg-clay-red hover:bg-clay-red/90 w-full text-white"
            >
              {revokeModal.submit}
            </Button>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-body hover:text-charcoal text-sm font-medium"
              >
                {revokeModal.cancel}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
