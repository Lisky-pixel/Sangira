import { MapPin, QrCode } from 'lucide-react'
import {
  formatCompletedLabel,
  formatPickupByTime,
} from '../../lib/format-listing-time'
import { openInMaps } from '../../lib/open-in-maps'
import { ngoMyRequestsContent } from '../../placeholder/ngo-my-requests-content'
import { postListingContent } from '../../placeholder/post-listing-content'
import { ngoRequestConfirmPath } from '../../routes/paths'
import type { NgoMyRequest } from '../../types/ngo-my-request'
import { ButtonLink } from '../ui/button'
import { StatusChip } from '../ui/status-chip'
import { VerifiedBadge } from '../ui/verified-badge'

type NgoAcceptedRequestCardProps = {
  request: NgoMyRequest
}

function formatDeadlineLabel(expiresAt: string) {
  const time = formatPickupByTime(expiresAt)
  const dayLabel = formatCompletedLabel(expiresAt)

  if (!time) {
    return ''
  }

  if (dayLabel === 'today') {
    return ngoMyRequestsContent.deadline.pickupByToday(time)
  }

  return ngoMyRequestsContent.deadline.pickupBy(time, dayLabel)
}

function resolvePickupAddress(request: NgoMyRequest) {
  return (
    request.listing.pickupAddress ??
    request.listing.pickupLocation?.address ??
    ''
  )
}

export function NgoAcceptedRequestCard({
  request,
}: NgoAcceptedRequestCardProps) {
  const unitLabel =
    postListingContent.quantityUnitLabels[request.listing.quantityUnit]
  const pickupAddress = resolvePickupAddress(request)
  const deadlineLabel = formatDeadlineLabel(request.listing.expiresAt)

  return (
    <article className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <StatusChip
        status="requested"
        label={ngoMyRequestsContent.status.accepted}
      />

      <h2 className="text-charcoal font-display mt-4 text-xl font-bold sm:text-2xl">
        {request.listing.title} — {request.listing.quantity} {unitLabel}
      </h2>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-charcoal text-sm font-medium">
          {request.donor.organisationName}
        </span>
        <VerifiedBadge />
      </div>

      <div className="bg-sand mt-5 rounded-xl px-4 py-4 sm:px-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <p className="text-charcoal text-xs font-semibold uppercase tracking-wide">
              {ngoMyRequestsContent.acceptedCard.pickupLocation}
            </p>
            {pickupAddress ? (
              <div className="mt-2">
                <p className="text-body flex items-start gap-2 text-sm">
                  <MapPin
                    aria-hidden="true"
                    className="text-primary mt-0.5 size-4 shrink-0"
                  />
                  <span>{pickupAddress}</span>
                </p>
                <button
                  type="button"
                  onClick={() => openInMaps(request.listing)}
                  className="text-primary mt-2 text-sm font-medium hover:underline"
                  aria-label={ngoMyRequestsContent.acceptedCard.openInMapsAria}
                >
                  {ngoMyRequestsContent.acceptedCard.openInMaps}
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-charcoal text-xs font-semibold uppercase tracking-wide">
              {ngoMyRequestsContent.acceptedCard.deadline}
            </p>
            {deadlineLabel ? (
              <p className="bg-status-pending-bg text-status-pending-text mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
                <span
                  aria-hidden="true"
                  className="bg-status-amber size-1.5 rounded-full"
                />
                {deadlineLabel}
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-charcoal text-xs font-semibold uppercase tracking-wide">
              {ngoMyRequestsContent.acceptedCard.confirmation}
            </p>
            {request.handoverReady ? (
              <p className="text-body mt-2 flex items-center gap-2 text-sm">
                <QrCode
                  aria-hidden="true"
                  className="text-primary size-4 shrink-0"
                />
                {ngoMyRequestsContent.acceptedCard.confirmationReady}
              </p>
            ) : null}
          </div>
        </div>

        <ButtonLink
          to={ngoRequestConfirmPath(request._id)}
          className="mt-5 w-full"
        >
          {ngoMyRequestsContent.acceptedCard.confirmPickup}
        </ButtonLink>
      </div>
    </article>
  )
}
