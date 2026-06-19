import { Link } from 'react-router'
import { LISTING_STATUS } from '../../constants/listing-status'
import {
  formatCompletedLabel,
  formatPickupByTime,
} from '../../lib/format-listing-time'
import { resolveListingTabStatus } from '../../lib/my-listings-filters'
import { hoursAgoFromIso } from '../../lib/relative-time'
import { cn } from '../../lib/utils'
import { myListingsContent } from '../../placeholder/my-listings-content'
import { donorListingManagePath } from '../../routes/paths'
import type { Listing } from '../../types/listing'
import { CountdownChip } from '../ui/countdown-chip'
import { StatusChip, type StatusChipVariant } from '../ui/status-chip'
import { ButtonLink } from '../ui/button'

type DonorListingCardProps = {
  listing: Listing
}

function getStatusChipVariant(listing: Listing): StatusChipVariant {
  const displayStatus = resolveListingTabStatus(listing)

  switch (displayStatus) {
    case LISTING_STATUS.REQUESTED:
      return 'requested'
    case LISTING_STATUS.AWAITING_PICKUP:
      return 'awaiting_pickup'
    case LISTING_STATUS.COMPLETED:
      return 'completed'
    case LISTING_STATUS.EXPIRED:
      return 'expired'
    default:
      return 'active'
  }
}

function isMutedListing(listing: Listing) {
  const displayStatus = resolveListingTabStatus(listing)
  return (
    displayStatus === LISTING_STATUS.COMPLETED ||
    displayStatus === LISTING_STATUS.EXPIRED
  )
}

export function DonorListingCard({ listing }: DonorListingCardProps) {
  const photo = listing.photos[0]
  const postedHours = hoursAgoFromIso(listing.createdAt)
  const displayStatus = resolveListingTabStatus(listing)
  const requestCount = listing.requestCount ?? 0
  const muted = isMutedListing(listing)

  const requestLabel =
    requestCount > 0
      ? myListingsContent.card.requestCount(requestCount)
      : myListingsContent.card.noRequests

  const footerPrimary =
    displayStatus === LISTING_STATUS.AWAITING_PICKUP &&
    listing.awaitingPickup
      ? myListingsContent.card.pickingUpBy(
          listing.awaitingPickup.ngoName,
          formatPickupByTime(listing.awaitingPickup.pickupBy),
        )
      : displayStatus === LISTING_STATUS.COMPLETED
        ? myListingsContent.card.completedAt(
            formatCompletedLabel(listing.updatedAt) ||
              myListingsContent.card.completedYesterday,
          )
        : displayStatus === LISTING_STATUS.EXPIRED
          ? myListingsContent.card.expiredAt(
              formatCompletedLabel(listing.expiresAt),
            )
          : null

  const showCountdown =
    displayStatus === LISTING_STATUS.ACTIVE ||
    displayStatus === LISTING_STATUS.REQUESTED

  return (
    <article
      className={cn(
        'border-border overflow-hidden rounded-2xl border bg-white shadow-sm',
        muted && 'opacity-80 saturate-[0.85]',
      )}
    >
      <div className="bg-sand aspect-[4/3] w-full overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt=""
            className={cn('size-full object-cover', muted && 'opacity-90')}
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <StatusChip status={getStatusChipVariant(listing)} />
        {showCountdown ? <CountdownChip expiresAt={listing.expiresAt} /> : null}
      </div>

      <div className="px-4 pt-3 pb-4">
        <h3 className="text-charcoal font-display text-base font-semibold">
          {listing.title}
        </h3>

        <div className="text-body mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {footerPrimary ? (
            <span>{footerPrimary}</span>
          ) : (
            <>
              <span>{myListingsContent.card.postedAgo(postedHours)}</span>
              <span aria-hidden="true">·</span>
              <span>{requestLabel}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <Link
            to={donorListingManagePath(listing._id)}
            className="text-primary font-medium hover:underline"
          >
            {myListingsContent.card.manage}
          </Link>
        </div>

        {displayStatus === LISTING_STATUS.AWAITING_PICKUP ? (
          <ButtonLink
            to={myListingsContent.routes.handover(listing._id)}
            variant="primary"
            className="mt-3 w-full"
          >
            {myListingsContent.card.continueHandover}
          </ButtonLink>
        ) : null}
      </div>
    </article>
  )
}
