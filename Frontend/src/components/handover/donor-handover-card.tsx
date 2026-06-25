import { formatHandoverPin } from '../../lib/format-handover-pin'
import { donorHandoverContent } from '../../placeholder/donor-handover-content'
import type { HandoverListing, HandoverParty } from '../../types/handover'
import { VerifiedBadge } from '../ui/verified-badge'
import { ParticipantActionButton } from '../participant/participant-action-control'
import { DonorHandoverChecklist } from './donor-handover-checklist'
import { HandoverQrCode } from './handover-qr-code'

type DonorHandoverCardProps = {
  otherParty: HandoverParty
  listing: HandoverListing
  pickupPin: string
  qrToken: string
  foodReady: boolean
  ngoArrived: boolean
  onFoodReadyChange: (checked: boolean) => void
  onNgoArrivedChange: (checked: boolean) => void
  onConfirm: () => void
  isConfirming: boolean
  showConfirmControls: boolean
}

export function DonorHandoverCard({
  otherParty,
  listing,
  pickupPin,
  qrToken,
  foodReady,
  ngoArrived,
  onFoodReadyChange,
  onNgoArrivedChange,
  onConfirm,
  isConfirming,
  showConfirmControls,
}: DonorHandoverCardProps) {
  const canConfirm = foodReady && ngoArrived && !isConfirming

  return (
    <article className="border-border w-full rounded-2xl border bg-white px-5 py-6 shadow-sm sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-charcoal font-display text-xl font-semibold">
          {donorHandoverContent.handoverTitle(otherParty.organisationName)}
        </h1>
        <VerifiedBadge label={donorHandoverContent.verifiedLabel} />
      </div>

      <p className="text-body mt-2 text-sm">
        {donorHandoverContent.listingSummary(listing)}
      </p>

      <div className="border-border mt-6 rounded-xl border bg-[#faf9f7] px-4 py-6 sm:px-6">
        <HandoverQrCode value={qrToken} />

        <p className="text-body mt-5 text-center text-xs font-medium tracking-wide uppercase">
          {donorHandoverContent.qr.pinFallback}
        </p>

        <p
          className="text-primary mt-3 text-center font-display text-4xl font-semibold tracking-[0.35em] sm:text-5xl"
          aria-label={`Pickup PIN ${pickupPin}`}
        >
          {formatHandoverPin(pickupPin)}
        </p>
      </div>

      {showConfirmControls ? (
        <div className="mt-6 flex flex-col gap-5">
          <DonorHandoverChecklist
            foodReady={foodReady}
            ngoArrived={ngoArrived}
            onFoodReadyChange={onFoodReadyChange}
            onNgoArrivedChange={onNgoArrivedChange}
            foodReadyLabel={donorHandoverContent.checklist.foodReady}
            ngoArrivedLabel={donorHandoverContent.checklist.ngoArrived}
            disabled={isConfirming}
          />

          <ParticipantActionButton
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            {donorHandoverContent.confirmButton}
          </ParticipantActionButton>
        </div>
      ) : null}
    </article>
  )
}
