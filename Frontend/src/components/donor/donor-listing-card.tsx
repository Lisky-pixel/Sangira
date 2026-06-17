import { Link } from 'react-router'
import { hoursAgoFromIso } from '../../lib/relative-time'
import { donorDashboardContent } from '../../placeholder/donor-dashboard-content'
import { donorListingManagePath } from '../../routes/paths'
import type { Listing } from '../../types/listing'
import { CountdownChip } from '../ui/countdown-chip'
import { StatusChip } from '../ui/status-chip'

type DonorListingCardProps = {
  listing: Listing
}

export function DonorListingCard({ listing }: DonorListingCardProps) {
  const photo = listing.photos[0]
  const postedHours = hoursAgoFromIso(listing.createdAt)
  const requestCount = listing.requestCount ?? 0
  const requestLabel =
    requestCount > 0
      ? donorDashboardContent.activeListings.requestCount(requestCount)
      : donorDashboardContent.activeListings.noRequests

  return (
    <article className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="bg-sand aspect-[4/3] w-full overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt=""
            className="size-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <StatusChip status="active" />
        <CountdownChip expiresAt={listing.expiresAt} />
      </div>

      <div className="px-4 pt-3 pb-4">
        <h3 className="text-charcoal font-display text-base font-semibold">
          {listing.title}
        </h3>

        <div className="text-body mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span>{donorDashboardContent.activeListings.postedAgo(postedHours)}</span>
          <span aria-hidden="true">·</span>
          <span>{requestLabel}</span>
          <span aria-hidden="true">·</span>
          <Link
            to={donorListingManagePath(listing._id)}
            className="text-primary font-medium hover:underline"
          >
            {donorDashboardContent.activeListings.manage}
          </Link>
        </div>
      </div>
    </article>
  )
}
