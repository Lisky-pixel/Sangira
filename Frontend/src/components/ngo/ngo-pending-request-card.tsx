import { formatRelativeTime } from '../../lib/relative-time'
import {
  NGO_DECLINED_REASON,
  ngoMyRequestsContent,
} from '../../placeholder/ngo-my-requests-content'
import { postListingContent } from '../../placeholder/post-listing-content'
import type { NgoMyRequest } from '../../types/ngo-my-request'
import { StatusChip } from '../ui/status-chip'
import { VerifiedBadge } from '../ui/verified-badge'

type NgoPendingRequestCardProps = {
  request: NgoMyRequest
}

export function NgoPendingRequestCard({ request }: NgoPendingRequestCardProps) {
  const unitLabel =
    postListingContent.quantityUnitLabels[request.listing.quantityUnit]
  const requestedLabel = formatRelativeTime(request.createdAt)

  return (
    <article className="border-border rounded-2xl border bg-white p-5 shadow-sm">
      <StatusChip status="requested" label={ngoMyRequestsContent.status.pending} />

      <h2 className="text-charcoal font-display mt-4 text-lg font-bold">
        {request.listing.title} — {request.listing.quantity} {unitLabel}
      </h2>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-charcoal text-sm font-medium">
          {request.donor.organisationName}
        </span>
        <VerifiedBadge />
      </div>

      <p className="text-body mt-3 text-sm">
        {ngoMyRequestsContent.pendingCard.requestedAgo(requestedLabel)}
      </p>
      <p className="text-body/80 mt-1 text-sm">
        {ngoMyRequestsContent.pendingCard.awaitingDecision}
      </p>
    </article>
  )
}

type NgoCompactRequestRowProps = {
  request: NgoMyRequest
}

export function NgoCompactRequestRow({ request }: NgoCompactRequestRowProps) {
  const unitLabel =
    postListingContent.quantityUnitLabels[request.listing.quantityUnit]
  const whenLabel = formatRelativeTime(
    request.completedAt ?? request.declinedAt ?? request.updatedAt,
  )

  const subcopy =
    request.status === 'completed'
      ? ngoMyRequestsContent.compactRow.completed(whenLabel)
      : ngoMyRequestsContent.compactRow.declined(
          request.declinedReason ??
            NGO_DECLINED_REASON.ANOTHER_ORGANISATION_ACCEPTED,
          whenLabel,
        )

  const chipStatus =
    request.status === 'completed' ? 'completed' : 'expired'
  const chipLabel =
    request.status === 'completed'
      ? ngoMyRequestsContent.status.completed
      : ngoMyRequestsContent.status.declined

  return (
    <article className="border-border flex items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={chipStatus} label={chipLabel} />
        </div>
        <p className="text-charcoal mt-2 text-sm font-semibold">
          {request.listing.title} — {request.listing.quantity} {unitLabel}
        </p>
        <p className="text-body mt-1 text-sm">
          {request.donor.organisationName} · {subcopy}
        </p>
      </div>
      <span aria-hidden="true" className="text-body shrink-0">
        ›
      </span>
    </article>
  )
}
