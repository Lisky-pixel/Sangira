import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { termsContent } from '../../placeholder/terms-content'
import { TermsContentView } from './terms-content-view'

type TermsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-charcoal/40" />
        <Dialog.Content className="border-border fixed top-1/2 left-1/2 z-[70] flex max-h-[min(85vh,720px)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border bg-white shadow-lg focus:outline-none">
          <div className="border-border flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
            <div className="min-w-0 pr-2">
              <Dialog.Title className="text-charcoal font-display text-lg font-bold sm:text-xl">
                {termsContent.modalTitle}
              </Dialog.Title>
              <Dialog.Description className="text-body mt-1 text-sm">
                {termsContent.effectiveDateLabel(termsContent.effectiveDate)}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-body hover:text-charcoal shrink-0 rounded-md p-1 transition-colors"
                aria-label={termsContent.closeLabel}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto px-5 py-4 sm:px-6">
            <TermsContentView showHeader={false} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
