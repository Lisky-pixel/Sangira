import { VerifiedBadge } from '../ui/verified-badge'
import { Button } from '../ui/button'
import { listingManageContent } from '../../placeholder/listing-manage-content'
import {
  getPlaceholderListingRequests,
  type PlaceholderListingRequest,
} from '../../placeholder/listing-manage-requests-data'
import { toast } from '../../lib/toast'
import { LISTING_STATUS } from '../../constants/listing-status'
import { resolveListingTabStatus } from '../../lib/my-listings-filters'
import type { Listing } from '../../types/listing'

type ManageListingRequestsProps = {
  listing: Listing
}

function RequestCard({ request }: { request: PlaceholderListingRequest }) {
  const handleAccept = () => {
    // PLACEHOLDER — no API call until Request model + accept endpoint ship
    toast.info(listingManageContent.requests.comingSoonToast)
  }

  return (
    <article className="border-border rounded-xl border bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-charcoal text-sm font-semibold">{request.ngoName}</h3>
        <VerifiedBadge />
      </div>

      <p className="text-body mt-2 text-sm">
        {listingManageContent.requests.capacityToday(request.capacityMeals)} ·{' '}
        {listingManageContent.requests.distanceAway(request.distanceKm)}
      </p>

      <p className="text-body mt-1 text-sm">
        {listingManageContent.requests.requestedAgo(request.requestedMinutesAgo)}
      </p>

      <Button
        type="button"
        className="mt-4 w-full"
        onClick={handleAccept}
      >
        {listingManageContent.requests.accept}
      </Button>
    </article>
  )
}

/**
 * PLACEHOLDER boundary — swap this column when live Request data + accept flow ship.
 * TODO: replace placeholder requests with live data from the Request model; wire
 * Accept → POST accept endpoint (declines siblings, moves listing → awaiting_pickup).
 */
export function ManageListingRequests({ listing }: ManageListingRequestsProps) {
  const displayStatus = resolveListingTabStatus(listing)
  const showPlaceholder =
    displayStatus === LISTING_STATUS.ACTIVE ||
    displayStatus === LISTING_STATUS.REQUESTED

  const requests = showPlaceholder
    ? getPlaceholderListingRequests(listing._id)
    : []

  return (
    <aside className="border-border rounded-2xl border bg-white p-5 sm:p-6">
      <h2 className="text-charcoal text-lg font-semibold">
        {listingManageContent.requests.heading(requests.length)}
      </h2>

      {requests.length === 0 ? (
        <p className="text-body mt-6 text-sm">
          {listingManageContent.requests.empty}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {requests.map((request) => (
            <li key={request.id}>
              <RequestCard request={request} />
            </li>
          ))}
        </ul>
      )}

      {requests.length > 0 ? (
        <p className="text-body mt-4 text-xs">
          {listingManageContent.requests.footnote}
        </p>
      ) : null}
    </aside>
  )
}
