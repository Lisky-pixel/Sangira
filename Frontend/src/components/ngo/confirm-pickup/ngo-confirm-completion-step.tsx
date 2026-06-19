import { Check, Leaf } from 'lucide-react'
import { QUANTITY_UNIT } from '../../../constants/listing-form'
import { computeHandoverDisplayImpact } from '../../../lib/handover-impact'
import { formatCompletedAt } from '../../../lib/format-completed-at'
import { ngoConfirmPickupContent } from '../../../placeholder/ngo-confirm-pickup-content'
import { NGO_REQUESTS_TAB } from '../../../constants/ngo-requests'
import { ngoRequestsPath, ROUTES } from '../../../routes/paths'
import type {
  HandoverCompletionImpact,
  HandoverListing,
  HandoverParty,
} from '../../../types/handover'
import { ButtonLink } from '../../ui/button'

type NgoConfirmCompletionStepProps = {
  otherParty: HandoverParty
  listing: HandoverListing
  completedAt?: string
  impact?: HandoverCompletionImpact
}

function buildImpactLine(
  listing: HandoverListing,
  impact?: HandoverCompletionImpact,
): string | null {
  if (impact) {
    if (listing.quantityUnit === QUANTITY_UNIT.SERVINGS && impact.mealsRedistributed > 0) {
      return ngoConfirmPickupContent.completion.impactMeals(
        impact.mealsRedistributed,
      )
    }

    if (listing.quantityUnit === QUANTITY_UNIT.KG && impact.wasteKgPrevented > 0) {
      return ngoConfirmPickupContent.completion.impactKg(
        impact.wasteKgPrevented,
      )
    }

    if (listing.quantityUnit === QUANTITY_UNIT.ITEMS) {
      const items = computeHandoverDisplayImpact(
        listing.quantity,
        listing.quantityUnit,
      ).items
      if (items > 0) {
        return ngoConfirmPickupContent.completion.impactItems(items)
      }
    }

    return null
  }

  const display = computeHandoverDisplayImpact(
    listing.quantity,
    listing.quantityUnit,
  )

  if (display.meals > 0) {
    return ngoConfirmPickupContent.completion.impactMeals(display.meals)
  }

  if (display.kg > 0) {
    return ngoConfirmPickupContent.completion.impactKg(display.kg)
  }

  if (display.items > 0) {
    return ngoConfirmPickupContent.completion.impactItems(display.items)
  }

  return null
}

export function NgoConfirmCompletionStep({
  otherParty,
  listing,
  completedAt,
  impact,
}: NgoConfirmCompletionStepProps) {
  const impactLine = buildImpactLine(listing, impact)
  const completedLabel = completedAt ? formatCompletedAt(completedAt) : ''

  return (
    <article className="border-border mx-auto w-full max-w-lg rounded-2xl border bg-white px-6 py-10 text-center shadow-sm sm:px-8">
      <div
        aria-hidden="true"
        className="bg-primary mx-auto flex size-16 items-center justify-center rounded-full text-white"
      >
        <Check className="size-8" strokeWidth={2.5} />
      </div>

      <p className="bg-mint-card text-primary mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold">
        <span
          aria-hidden="true"
          className="bg-primary size-2 rounded-full"
        />
        {ngoConfirmPickupContent.completion.pill}
      </p>

      <h1 className="text-charcoal mt-5 font-display text-2xl font-semibold">
        {ngoConfirmPickupContent.completion.heading}
      </h1>

      <p className="text-body mt-3 text-sm leading-relaxed">
        {ngoConfirmPickupContent.completion.receiptLine({
          title: listing.title,
          quantity: listing.quantity,
          quantityUnit: listing.quantityUnit,
          donorName: otherParty.organisationName,
        })}
      </p>

      {completedLabel ? (
        <p className="text-body/70 mt-2 text-sm">{completedLabel}</p>
      ) : null}

      {impactLine ? (
        <>
          <hr className="border-border mt-6" />
          <div className="text-primary mt-6 flex items-center justify-center gap-2 text-sm font-medium">
            <Leaf aria-hidden="true" className="size-4 shrink-0" />
            <span>{impactLine}</span>
          </div>
        </>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink
          to={ngoRequestsPath(NGO_REQUESTS_TAB.ACCEPTED)}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {ngoConfirmPickupContent.completion.viewRequests}
        </ButtonLink>
        <ButtonLink
          to={ROUTES.NGO_BROWSE}
          variant="primary"
          className="w-full sm:w-auto"
        >
          {ngoConfirmPickupContent.completion.browseMore}
        </ButtonLink>
      </div>
    </article>
  )
}
