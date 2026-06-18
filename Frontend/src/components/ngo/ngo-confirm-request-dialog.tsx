import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { formatPickupDeadline } from '../../lib/format-listing-time'
import { ngoListingDetailContent } from '../../placeholder/ngo-listing-detail-content'
import { postListingContent } from '../../placeholder/post-listing-content'
import type { NgoBrowseListing } from '../../types/ngo-browse-listing'
import { Button } from '../ui/button'

type NgoConfirmRequestDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: NgoBrowseListing
  onConfirm: () => void | Promise<void>
}

export function NgoConfirmRequestDialog({
  open,
  onOpenChange,
  listing,
  onConfirm,
}: NgoConfirmRequestDialogProps) {
  const photo = listing.photos[0]
  const unitLabel = postListingContent.quantityUnitLabels[listing.quantityUnit]
  const pickupDeadline = formatPickupDeadline(listing.expiresAt)
  const summary = ngoListingDetailContent.confirm.summary({
    quantity: listing.quantity,
    unitLabel,
    title: listing.title,
    organisationName: listing.donor.organisationName,
    pickupDeadline,
  })

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-charcoal/40" />
        <Dialog.Content className="border-border fixed top-1/2 left-1/2 z-50 flex max-h-[min(90vh,40rem)] w-[min(100vw-2rem,28rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border bg-white shadow-lg focus:outline-none">
          <div className="bg-sand relative aspect-[4/3] w-full shrink-0 overflow-hidden">
            {photo ? (
              <img
                src={photo}
                alt=""
                className="size-full object-cover"
              />
            ) : null}
            <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-charcoal/75 px-3 py-1 text-xs font-medium text-white">
              <span
                aria-hidden="true"
                className="bg-verified size-1.5 rounded-full"
              />
              {ngoListingDetailContent.confirm.stepLabel}
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-charcoal hover:text-primary absolute top-3 left-3 rounded-md bg-white/90 p-1.5 transition-colors"
                aria-label={ngoListingDetailContent.confirm.cancel}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:p-6">
            <Dialog.Title className="text-charcoal text-center text-xl font-bold">
              {ngoListingDetailContent.confirm.title}
            </Dialog.Title>
            <Dialog.Description className="text-body text-center text-sm leading-relaxed">
              {summary}
            </Dialog.Description>

            <Button type="button" className="w-full" onClick={() => void onConfirm()}>
              {ngoListingDetailContent.confirm.confirm}
            </Button>

            <Dialog.Close asChild>
              <button
                type="button"
                className="text-body hover:text-primary text-center text-sm font-medium transition-colors"
              >
                {ngoListingDetailContent.confirm.cancel}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
