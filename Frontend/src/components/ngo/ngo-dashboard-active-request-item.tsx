import {
  formatCompletedLabel,
  formatPickupByTime,
} from '../../lib/format-listing-time'
import { ngoMyRequestsContent } from '../../placeholder/ngo-my-requests-content'
import { postListingContent } from '../../placeholder/post-listing-content'
import type { NgoMyRequest } from '../../types/ngo-my-request'
import { REQUEST_STATUS } from '../../constants/request-status'
import { StatusChip } from '../ui/status-chip'
import { VerifiedBadge } from '../ui/verified-badge'

type NgoDashboardActiveRequestItemProps = {
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

export function NgoDashboardActiveRequestItem({
  request,
}: NgoDashboardActiveRequestItemProps) {
  const unitLabel =
    postListingContent.quantityUnitLabels[request.listing.quantityUnit]
  const isAccepted = request.status === REQUEST_STATUS.ACCEPTED
  const deadlineLabel = isAccepted
    ? formatDeadlineLabel(request.listing.expiresAt)
    : ''

  return (
    <article className="border-border rounded-xl border bg-white px-4 py-4">
      <StatusChip
        status={isAccepted ? 'requested' : 'pending'}
        label={
          isAccepted
            ? ngoMyRequestsContent.status.accepted
            : ngoMyRequestsContent.status.pending
        }
      />

      <h3 className="text-charcoal font-display mt-3 text-base font-semibold">
        {request.listing.title} — {request.listing.quantity} {unitLabel}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-charcoal text-sm font-medium">
          {request.donor.organisationName}
        </span>
        <VerifiedBadge />
      </div>

      {deadlineLabel ? (
        <p className="bg-status-pending-bg text-status-pending-text mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
          <span
            aria-hidden="true"
            className="bg-status-amber size-1.5 rounded-full"
          />
          {deadlineLabel}
        </p>
      ) : null}
    </article>
  )
}
