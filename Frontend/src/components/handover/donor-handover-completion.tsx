import { Check, Scale } from 'lucide-react'
import { computeHandoverDisplayImpact } from '../../lib/handover-impact'
import { formatCompletedAt } from '../../lib/format-completed-at'
import { donorHandoverContent } from '../../placeholder/donor-handover-content'
import { ROUTES } from '../../routes/paths'
import type { HandoverListing, HandoverParty } from '../../types/handover'
import { postListingContent } from '../../placeholder/post-listing-content'
import { ButtonLink } from '../ui/button'

type DonorHandoverCompletionProps = {
  otherParty: HandoverParty
  listing: HandoverListing
  completedAt?: string
}

function buildImpactLine(listing: HandoverListing): string | null {
  const impact = computeHandoverDisplayImpact(
    listing.quantity,
    listing.quantityUnit,
  )
  const parts: string[] = []

  if (impact.meals > 0) {
    parts.push(donorHandoverContent.completion.impactMeals(impact.meals))
  }

  if (impact.kg > 0) {
    parts.push(donorHandoverContent.completion.impactKg(impact.kg))
  }

  if (impact.items > 0) {
    parts.push(donorHandoverContent.completion.impactItems(impact.items))
  }

  return parts.length > 0 ? parts.join(' · ') : null
}

export function DonorHandoverCompletion({
  otherParty,
  listing,
  completedAt,
}: DonorHandoverCompletionProps) {
  const unitLabel = postListingContent.quantityUnitLabels[listing.quantityUnit]
  const listingLine = `${listing.title} — ${listing.quantity} ${unitLabel}`
  const impactLine = buildImpactLine(listing)
  const completedLabel = completedAt ? formatCompletedAt(completedAt) : ''

  return (
    <article className="border-border mx-auto w-full max-w-lg rounded-2xl border bg-white px-6 py-10 text-center shadow-sm sm:px-8">
      <div
        aria-hidden="true"
        className="bg-primary mx-auto flex size-16 items-center justify-center rounded-full text-white"
      >
        <Check className="size-8" strokeWidth={2.5} />
      </div>

      <p className="bg-primary mt-6 inline-flex rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase">
        ✓ {donorHandoverContent.completion.pill}
      </p>

      <h1 className="text-charcoal mt-5 font-display text-2xl font-semibold">
        {donorHandoverContent.completion.heading}
      </h1>

      <p className="text-body mt-3 text-sm leading-relaxed">
        {donorHandoverContent.completion.receiptLine(
          otherParty.organisationName,
          listingLine,
        )}
      </p>

      {completedLabel ? (
        <p className="text-body/70 mt-2 text-sm">{completedLabel}</p>
      ) : null}

      {impactLine ? (
        <div className="bg-mint-card text-primary mt-6 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium">
          <Scale aria-hidden="true" className="size-4 shrink-0" />
          <span>{impactLine}</span>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink
          to={ROUTES.DONOR_LISTINGS}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {donorHandoverContent.completion.viewListings}
        </ButtonLink>
        <ButtonLink
          to={ROUTES.POST_LISTING}
          variant="primary"
          className="w-full sm:w-auto"
        >
          {donorHandoverContent.completion.postAnother}
        </ButtonLink>
      </div>
    </article>
  )
}
