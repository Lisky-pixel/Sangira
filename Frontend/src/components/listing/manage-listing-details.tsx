import * as Dialog from '@radix-ui/react-dialog'
import {
  AlertTriangle,
  CircleCheck,
  CircleX,
  Flame,
  Leaf,
  MapPin,
  Moon,
  Snowflake,
  Sun,
  Utensils,
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { FOOD_LABEL, STORAGE_CONDITION } from '../../constants/listing-form'
import {
  canCancelListing,
  canEditListing,
  getStatusChipVariant,
  shouldShowCountdownChip,
} from '../../lib/listing-manage'
import { openInMaps } from '../../lib/open-in-maps'
import { toast } from '../../lib/toast'
import { cn } from '../../lib/utils'
import { listingManageContent } from '../../placeholder/listing-manage-content'
import { postListingContent } from '../../placeholder/post-listing-content'
import {
  donorListingEditPath,
  ROUTES,
} from '../../routes/paths'
import { listingService } from '../../services/listing-service'
import type { Listing } from '../../types/listing'
import type { FoodLabel, StorageCondition } from '../../constants/listing-form'
import { CountdownChip } from '../ui/countdown-chip'
import { StatusChip } from '../ui/status-chip'
import { Button } from '../ui/button'
import { ManageListingRequests } from './manage-listing-requests'

type ManageListingDetailsProps = {
  listing: Listing
}

function storageIcon(condition: StorageCondition) {
  switch (condition) {
    case STORAGE_CONDITION.REFRIGERATED:
      return Snowflake
    case STORAGE_CONDITION.HOT_HELD:
      return Flame
    default:
      return Sun
  }
}

function foodLabelIcon(label: FoodLabel) {
  switch (label) {
    case FOOD_LABEL.VEGETARIAN:
      return Leaf
    case FOOD_LABEL.HALAL:
      return Moon
    case FOOD_LABEL.CONTAINS_ALLERGENS:
      return AlertTriangle
    case FOOD_LABEL.REQUIRES_REHEATING:
      return Flame
    default:
      return Leaf
  }
}

function DetailRow({
  icon: Icon,
  children,
}: {
  icon: typeof Utensils
  children: ReactNode
}) {
  return (
    <div className="text-body flex items-center gap-2 text-sm">
      <Icon aria-hidden="true" className="text-primary size-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

export function ManageListingDetails({ listing }: ManageListingDetailsProps) {
  const navigate = useNavigate()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const photo = listing.photos[0]
  const editable = canEditListing(listing)
  const cancellable = canCancelListing(listing)
  const StorageIcon = storageIcon(listing.storageCondition)
  const unitLabel = postListingContent.quantityUnitLabels[listing.quantityUnit]
  const storageLabel =
    postListingContent.storageLabels[listing.storageCondition]

  const handleEditClick = () => {
    if (!editable) {
      toast.info(listingManageContent.actions.editDisabledReason)
    }
  }

  const handleCancelConfirm = async () => {
    setIsCancelling(true)
    try {
      await toast.promise(listingService.cancelListing(listing._id), {
        loading: listingManageContent.cancelToast.loading,
        success: listingManageContent.cancelToast.success,
        error: listingManageContent.cancelToast.error,
      })
      navigate(listingManageContent.routes.myListings)
    } catch {
      setIsCancelling(false)
    }
  }

  return (
    <section className="border-border rounded-2xl border bg-white">
      <div className="bg-sand aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
        {photo ? (
          <img
            src={photo}
            alt=""
            className="size-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={getStatusChipVariant(listing)} />
          {shouldShowCountdownChip(listing) ? (
            <CountdownChip expiresAt={listing.expiresAt} />
          ) : null}
        </div>

        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {listing.title}
        </h1>

        <div className="flex flex-col gap-2">
          <DetailRow icon={Utensils}>
            {listing.quantity} {unitLabel}
          </DetailRow>
          <DetailRow icon={StorageIcon}>{storageLabel}</DetailRow>
          {listing.foodLabels.map((label) => {
            const LabelIcon = foodLabelIcon(label)
            return (
              <DetailRow key={label} icon={LabelIcon}>
                {postListingContent.foodLabelLabels[label]}
              </DetailRow>
            )
          })}
        </div>

        <div>
          <button
            type="button"
            onClick={() => openInMaps(listing)}
            className="text-charcoal hover:text-primary focus-visible:outline-primary inline-flex cursor-pointer items-start gap-2 text-left text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <MapPin
              aria-hidden="true"
              className="text-primary mt-0.5 size-4 shrink-0"
            />
            <span>
              {listingManageContent.pickup.atPrefix}{' '}
              {listing.pickupAddress}
            </span>
          </button>
        </div>

        {listing.pickupInstructions ? (
          <div className="bg-sand text-charcoal rounded-xl px-4 py-3 text-sm italic">
            {listingManageContent.pickup.instructionsPrefix}{' '}
            {listing.pickupInstructions}
          </div>
        ) : null}

        <hr className="border-border" />

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {cancellable ? (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="text-clay-red hover:text-clay-red/80 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <CircleX aria-hidden="true" className="size-4" />
              {listingManageContent.actions.cancelListing}
            </button>
          ) : null}

          {editable ? (
            <Link
              to={donorListingEditPath(listing._id)}
              className="text-primary hover:text-primary-hover inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <CircleCheck aria-hidden="true" className="size-4" />
              {listingManageContent.actions.editListing}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleEditClick}
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium',
                'text-body/50 cursor-not-allowed',
              )}
              aria-disabled="true"
            >
              <CircleCheck aria-hidden="true" className="size-4" />
              {listingManageContent.actions.editListing}
            </button>
          )}
        </div>
      </div>

      <Dialog.Root open={cancelOpen} onOpenChange={setCancelOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-charcoal/40" />
          <Dialog.Content className="border-border fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 shadow-lg focus:outline-none">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="text-charcoal text-lg font-semibold">
                {listingManageContent.cancelModal.title}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="text-body hover:text-charcoal"
                  aria-label={listingManageContent.cancelModal.dismiss}
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="text-body mt-2 text-sm">
              {listingManageContent.cancelModal.description}
            </Dialog.Description>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">
                  {listingManageContent.cancelModal.dismiss}
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                disabled={isCancelling}
                className="bg-clay-red hover:bg-clay-red/90 text-white"
                onClick={handleCancelConfirm}
              >
                {listingManageContent.cancelModal.confirm}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}

type ManageListingPageProps = {
  listing: Listing
}

export function ManageListingLayout({ listing }: ManageListingPageProps) {
  return (
  <div className="flex flex-col gap-6">
    <Link
      to={ROUTES.DONOR_LISTINGS}
      className="text-body hover:text-primary inline-flex items-center gap-1 text-sm font-medium transition-colors"
    >
      ← {listingManageContent.backLink}
    </Link>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
      <ManageListingDetails listing={listing} />
      <ManageListingRequests listing={listing} />
    </div>
  </div>
  )
}
