import * as Dialog from '@radix-ui/react-dialog'
import { adminUsersContent } from '../../placeholder/admin-users-content'
import { Button } from '../ui/button'

type AdminUserReactivateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organisationName: string
  submitting: boolean
  onSubmit: () => void
}

export function AdminUserReactivateModal({
  open,
  onOpenChange,
  organisationName,
  submitting,
  onSubmit,
}: AdminUserReactivateModalProps) {
  const { reactivateModal } = adminUsersContent

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-charcoal/40" />
        <Dialog.Content className="border-border fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-charcoal text-lg font-semibold">
            {reactivateModal.title(organisationName)}
          </Dialog.Title>
          <Dialog.Description className="text-body mt-2 text-sm">
            {reactivateModal.description(organisationName)}
          </Dialog.Description>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              disabled={submitting}
              onClick={onSubmit}
              className="w-full"
            >
              {reactivateModal.submit}
            </Button>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-body hover:text-charcoal text-sm font-medium"
              >
                {reactivateModal.cancel}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
