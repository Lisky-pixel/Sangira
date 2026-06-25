import { Check } from 'lucide-react'
import { HANDOVER_CONDITION, type HandoverCondition } from '../../../constants/handover-condition'
import { ngoConfirmPickupContent } from '../../../placeholder/ngo-confirm-pickup-content'
import { postListingContent } from '../../../placeholder/post-listing-content'
import type { HandoverListing, HandoverParty } from '../../../types/handover'
import { ParticipantActionButton } from '../../participant/participant-action-control'
import { VerifiedBadge } from '../../ui/verified-badge'

const CONDITION_OPTIONS = [
  HANDOVER_CONDITION.AS_DESCRIBED,
  HANDOVER_CONDITION.PARTIAL,
  HANDOVER_CONDITION.ISSUE,
] as const

type NgoConfirmConditionStepProps = {
  otherParty: HandoverParty
  listing: HandoverListing
  condition: HandoverCondition
  note: string
  isSubmitting: boolean
  onConditionChange: (condition: HandoverCondition) => void
  onNoteChange: (note: string) => void
  onConfirm: () => void
}

export function NgoConfirmConditionStep({
  otherParty,
  listing,
  condition,
  note,
  isSubmitting,
  onConditionChange,
  onNoteChange,
  onConfirm,
}: NgoConfirmConditionStepProps) {
  const unitLabel = postListingContent.quantityUnitLabels[listing.quantityUnit]
  const photo = listing.photos[0]

  return (
    <article className="border-border mx-auto w-full max-w-lg rounded-2xl border bg-white px-5 py-6 shadow-sm sm:px-6">
      <div className="bg-mint-card text-primary mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium">
        <Check aria-hidden="true" className="size-4 shrink-0" />
        <span>{ngoConfirmPickupContent.conditionStep.verifiedStrip}</span>
      </div>

      <h1 className="text-charcoal font-display text-xl font-semibold">
        {ngoConfirmPickupContent.conditionStep.title}
      </h1>

      <div className="bg-sand mt-5 flex items-center gap-4 rounded-xl px-4 py-4">
        <div className="bg-cream size-16 shrink-0 overflow-hidden rounded-lg">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="size-full object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="text-charcoal text-sm font-semibold">
            {listing.title} — {listing.quantity} {unitLabel}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-body text-sm">
              {ngoConfirmPickupContent.conditionStep.fromDonor(
                otherParty.organisationName,
              )}
            </span>
            <VerifiedBadge />
          </div>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-charcoal mb-3 text-sm font-medium">
          {ngoConfirmPickupContent.conditionStep.conditionLabel}
        </legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {CONDITION_OPTIONS.map((option) => {
            const selected = condition === option
            return (
              <button
                key={option}
                type="button"
                disabled={isSubmitting}
                onClick={() => onConditionChange(option)}
                className={
                  selected
                    ? 'bg-primary rounded-lg px-4 py-2.5 text-sm font-medium text-white'
                    : 'border-primary text-primary rounded-lg border-2 bg-white px-4 py-2.5 text-sm font-medium'
                }
              >
                {ngoConfirmPickupContent.conditionStep.conditions[option]}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label
          htmlFor="condition-note"
          className="text-charcoal mb-2 block text-sm font-medium"
        >
          {ngoConfirmPickupContent.conditionStep.noteLabel}
        </label>
        <textarea
          id="condition-note"
          value={note}
          disabled={isSubmitting}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder={ngoConfirmPickupContent.conditionStep.notePlaceholder}
          rows={3}
          className="border-border text-charcoal placeholder:text-body/50 focus:ring-primary w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm shadow-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <ParticipantActionButton
        type="button"
        variant="primary"
        size="lg"
        className="mt-6 w-full"
        disabled={isSubmitting}
        onClick={onConfirm}
      >
        {ngoConfirmPickupContent.conditionStep.confirmButton}
      </ParticipantActionButton>

      <p className="text-body/70 mt-3 text-center text-sm">
        {ngoConfirmPickupContent.conditionStep.confirmSubcopy}
      </p>
    </article>
  )
}
