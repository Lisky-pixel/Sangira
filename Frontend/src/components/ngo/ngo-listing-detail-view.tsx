import {
  AlertTriangle,
  Flame,
  Leaf,
  MapPin,
  Shield,
  Snowflake,
  Thermometer,
  Utensils,
  type LucideIcon,
} from 'lucide-react'
import { useState, Suspense, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { NGO_REQUESTS_TAB } from '../../constants/ngo-requests'
import { REQUEST_ERROR_CODES } from '../../constants/request'
import { FOOD_LABEL, STORAGE_CONDITION } from '../../constants/listing-form'
import { CLOUDINARY_DELIVERY_WIDTH } from '../../constants/cloudinary-delivery'
import type { FoodLabel, StorageCondition } from '../../constants/listing-form'
import { formatMemberSince } from '../../lib/format-listing-time'
import {
  formatDistanceAway,
  getDistanceForListing,
  getListingCoordinates,
  type LngLat,
} from '../../lib/distance'
import { cloudinaryDeliveryUrl } from '../../lib/cloudinary-delivery-url'
import { getOrgInitials } from '../../lib/org-initials'
import { openInMaps } from '../../lib/open-in-maps'
import { ngoListingDetailContent } from '../../placeholder/ngo-listing-detail-content'
import { postListingContent } from '../../placeholder/post-listing-content'
import { ngoRequestsPath } from '../../routes/paths'
import { requestService } from '../../services/request-service'
import { ApiError } from '../../services/api-error'
import { toast } from '../../lib/toast'
import type { NgoBrowseListing } from '../../types/ngo-browse-listing'
import { ButtonLink } from '../ui/button'
import { ParticipantActionButton } from '../participant/participant-action-control'
import { CountdownChip } from '../ui/countdown-chip'
import { StatusChip } from '../ui/status-chip'
import { VerifiedBadge } from '../ui/verified-badge'
import { NgoConfirmRequestDialog } from './ngo-confirm-request-dialog'
import { NgoPickupMiniMapLazy } from './ngo-pickup-mini-map-lazy'

type NgoListingDetailViewProps = {
  listing: NgoBrowseListing
  ngoCoordinates?: LngLat | null
}

function storageIcon(condition: StorageCondition): LucideIcon {
  switch (condition) {
    case STORAGE_CONDITION.REFRIGERATED:
      return Snowflake
    case STORAGE_CONDITION.HOT_HELD:
      return Flame
    default:
      return Thermometer
  }
}

function foodLabelIcon(label: FoodLabel): LucideIcon {
  switch (label) {
    case FOOD_LABEL.VEGETARIAN:
      return Leaf
    case FOOD_LABEL.HALAL:
      return Shield
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
  icon: LucideIcon
  children: ReactNode
}) {
  return (
    <div className="text-body flex items-center gap-2 text-sm">
      <Icon aria-hidden="true" className="text-primary size-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

function resolvePickupAddress(listing: NgoBrowseListing) {
  return listing.pickupAddress ?? listing.pickupLocation?.address ?? ''
}

export function NgoListingDetailView({
  listing,
  ngoCoordinates = null,
}: NgoListingDetailViewProps) {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [hasRequested, setHasRequested] = useState(
    listing.hasRequested ?? false,
  )

  const photo = listing.photos[0]
  const photoSrc = photo
    ? cloudinaryDeliveryUrl(photo, CLOUDINARY_DELIVERY_WIDTH.DETAIL)
    : null
  const unitLabel = postListingContent.quantityUnitLabels[listing.quantityUnit]
  const storageLabel =
    postListingContent.storageLabels[listing.storageCondition]
  const StorageIcon = storageIcon(listing.storageCondition)
  const pickupAddress = resolvePickupAddress(listing)
  const distanceKm = getDistanceForListing(ngoCoordinates, listing)
  const distanceAway =
    distanceKm !== null ? formatDistanceAway(distanceKm) : null
  const pickupCoordinates = getListingCoordinates(listing)
  const donorInitials = getOrgInitials(listing.donor.organisationName)
  const memberSince = formatMemberSince(listing.donor.createdAt)
  const completedTransfers = listing.donor.completedTransfers
  const donorAvatarUrl = listing.donor.avatarUrl
    ? cloudinaryDeliveryUrl(
        listing.donor.avatarUrl,
        CLOUDINARY_DELIVERY_WIDTH.AVATAR,
      )
    : undefined

  const handleConfirmRequest = async () => {
    const createPromise = requestService.createRequest({
      listingId: listing._id,
    })

    try {
      await toast.promise(createPromise, {
        loading: ngoListingDetailContent.confirm.toast.loading,
        success: ngoListingDetailContent.confirm.toast.success,
        error: (error) =>
          error instanceof ApiError
            ? error.message
            : ngoListingDetailContent.confirm.toast.error,
      })
      setHasRequested(true)
      setConfirmOpen(false)
    } catch (error) {
      if (!(error instanceof ApiError)) {
        return
      }

      if (error.code === REQUEST_ERROR_CODES.REQUEST_ALREADY_EXISTS) {
        setHasRequested(true)
        setConfirmOpen(false)
        return
      }

      if (
        error.code === REQUEST_ERROR_CODES.LISTING_NOT_AVAILABLE ||
        error.code === REQUEST_ERROR_CODES.LISTING_NOT_ACCEPTING
      ) {
        toast.error(error.message, {
          action: {
            label: ngoListingDetailContent.confirm.toast.listingUnavailableAction,
            onClick: () => {
              navigate(ngoListingDetailContent.routes.browse)
            },
          },
        })
      }
    }
  }

  return (
    <>
      <Link
        to={ngoListingDetailContent.routes.browse}
        className="text-body hover:text-primary mb-2 inline-flex items-center gap-1 text-sm font-medium transition-colors"
      >
        <span aria-hidden="true">←</span>
        {ngoListingDetailContent.backLink}
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="bg-sand aspect-[4/3] w-full overflow-hidden rounded-2xl">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt=""
                className="size-full object-cover"
              />
            ) : null}
          </div>

          <section className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip status="active" />
              <CountdownChip expiresAt={listing.expiresAt} />
            </div>

            <h1 className="text-charcoal font-display mt-4 text-2xl font-bold sm:text-3xl">
              {listing.title}
            </h1>

            <div className="mt-5 flex flex-col gap-2">
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

            {listing.pickupInstructions ? (
              <div className="bg-sand mt-5 rounded-xl px-4 py-3">
                <p className="text-charcoal text-sm font-semibold">
                  {ngoListingDetailContent.pickup.instructionsTitle}
                </p>
                <p className="text-body mt-1 text-sm">
                  {listing.pickupInstructions}
                </p>
              </div>
            ) : null}

            <div className="mt-5">
              <h2 className="text-charcoal text-sm font-semibold">
                {ngoListingDetailContent.pickup.locationHeading}
              </h2>

              {distanceAway ? (
                <p className="text-body mt-2 text-sm">
                  {pickupAddress
                    ? ngoListingDetailContent.pickup.distanceLine(
                        distanceAway,
                        pickupAddress,
                      )
                    : distanceAway}
                </p>
              ) : null}

              {pickupAddress ? (
                <button
                  type="button"
                  onClick={() => openInMaps(listing)}
                  className="text-charcoal focus-visible:outline-primary mt-2 inline-flex cursor-pointer items-start gap-2 text-left text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  aria-label={ngoListingDetailContent.pickup.openInMapsAria}
                >
                  <MapPin
                    aria-hidden="true"
                    className="text-primary mt-0.5 size-4 shrink-0"
                  />
                  <span>{pickupAddress}</span>
                </button>
              ) : null}

              {pickupCoordinates ? (
                <Suspense
                  fallback={
                    <p className="text-body mt-4 text-sm">
                      {ngoListingDetailContent.pickup.miniMapLoading}
                    </p>
                  }
                >
                  <NgoPickupMiniMapLazy
                    pickupCoordinates={pickupCoordinates}
                    ngoCoordinates={ngoCoordinates}
                  />
                </Suspense>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <section className="border-border rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-charcoal font-display text-lg font-bold">
                  {listing.donor.organisationName}
                </h2>
                <VerifiedBadge
                  label={ngoListingDetailContent.donorCard.verified}
                  className="mt-1"
                />
              </div>

              {donorAvatarUrl ? (
                <img
                  src={donorAvatarUrl}
                  alt=""
                  className="size-14 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="bg-mint-card text-primary flex size-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
                >
                  {donorInitials}
                </div>
              )}
            </div>

            <div
              aria-hidden="true"
              className="border-border my-4 border-t"
            />

            <p className="text-body text-sm">
              {ngoListingDetailContent.donorCard.completedTransfers(
                completedTransfers,
              )}
            </p>
            {memberSince ? (
              <p className="text-body mt-1 text-sm">
                {ngoListingDetailContent.donorCard.memberSince(memberSince)}
              </p>
            ) : null}
          </section>

          <section className="border-border rounded-2xl border bg-white p-5 shadow-sm">
            <ParticipantActionButton
              type="button"
              className="w-full"
              disabled={hasRequested}
              aria-label={
                hasRequested
                  ? ngoListingDetailContent.request.alreadyRequestedAria
                  : undefined
              }
              onClick={() => setConfirmOpen(true)}
            >
              {hasRequested
                ? ngoListingDetailContent.request.requested
                : ngoListingDetailContent.request.requestFood}
            </ParticipantActionButton>
            {hasRequested ? (
              <div className="mt-3 text-center">
                <ButtonLink
                  to={ngoRequestsPath(NGO_REQUESTS_TAB.PENDING)}
                  variant="ghost"
                  className="text-sm"
                >
                  {ngoListingDetailContent.request.viewMyRequests}
                </ButtonLink>
              </div>
            ) : (
              <p className="text-body mt-3 text-center text-xs sm:text-sm">
                {ngoListingDetailContent.request.notifyNote(
                  listing.donor.organisationName,
                )}
              </p>
            )}
          </section>
        </aside>
      </div>

      <NgoConfirmRequestDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        listing={listing}
        onConfirm={handleConfirmRequest}
      />
    </>
  )
}
