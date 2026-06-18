import { ngoBrowseContent } from '../../placeholder/ngo-browse-content'
import { ngoListingDetailPath } from '../../routes/paths'
import type { NgoBrowseListing } from '../../types/ngo-browse-listing'
import { ButtonLink } from '../ui/button'
import { CountdownChip } from '../ui/countdown-chip'
import { StatusChip } from '../ui/status-chip'
import { VerifiedBadge } from '../ui/verified-badge'

type NgoListingCardProps = {
  listing: NgoBrowseListing
  hasRequested?: boolean
}

export function NgoListingCard({ listing, hasRequested = false }: NgoListingCardProps) {
  const photo = listing.photos[0]
  const storageLabel =
    ngoBrowseContent.storageLabels[listing.storageCondition]

  return (
    <article className="border-border flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
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

      <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
        <h3 className="text-charcoal font-display text-base font-semibold">
          {listing.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-charcoal text-sm font-medium">
            {listing.donor.organisationName}
          </span>
          <VerifiedBadge label={ngoBrowseContent.card.verifiedDonor} />
        </div>

        <p className="text-body mt-2 text-sm">
          {ngoBrowseContent.card.storageOnly(storageLabel)}
        </p>

        <div className="mt-auto pt-4">
          <ButtonLink
            to={ngoListingDetailPath(listing._id)}
            className="w-full"
          >
            {hasRequested
              ? ngoBrowseContent.card.requested
              : ngoBrowseContent.card.request}
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
