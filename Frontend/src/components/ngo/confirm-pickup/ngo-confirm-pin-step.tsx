import { Camera } from 'lucide-react'
import { HANDOVER } from '../../../constants/handover'
import { ngoConfirmPickupContent } from '../../../placeholder/ngo-confirm-pickup-content'
import type { HandoverListing, HandoverParty } from '../../../types/handover'
import { OtpInput } from '../../form/otp-input'
import { Button } from '../../ui/button'
import { VerifiedBadge } from '../../ui/verified-badge'

type NgoConfirmPinStepProps = {
  otherParty: HandoverParty
  listing: HandoverListing
  pin: string
  pinError?: string
  onPinChange: (value: string) => void
  onContinue: () => void
  onScanQr: () => void
}

export function NgoConfirmPinStep({
  otherParty,
  listing,
  pin,
  pinError,
  onPinChange,
  onContinue,
  onScanQr,
}: NgoConfirmPinStepProps) {
  const pinComplete = pin.length === HANDOVER.PICKUP_PIN_LENGTH

  return (
    <div className="mx-auto w-full max-w-lg">
      <article className="border-border rounded-2xl border bg-white px-5 py-6 shadow-sm sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-charcoal font-display text-xl font-semibold">
            {ngoConfirmPickupContent.pinStep.title(
              otherParty.organisationName,
            )}
          </h1>
          <VerifiedBadge label={ngoConfirmPickupContent.pinStep.verifiedLabel} />
        </div>

        <p className="text-body mt-2 text-sm">
          {ngoConfirmPickupContent.pinStep.listingSummary(listing)}
        </p>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="mt-6 w-full gap-2"
          onClick={onScanQr}
        >
          <Camera aria-hidden="true" className="size-5" />
          {ngoConfirmPickupContent.pinStep.scanQr}
        </Button>

        <div className="relative my-6">
          <div className="border-border absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-body/70">
              {ngoConfirmPickupContent.pinStep.divider}
            </span>
          </div>
        </div>

        <OtpInput
          length={HANDOVER.PICKUP_PIN_LENGTH}
          value={pin}
          onChange={onPinChange}
          label={ngoConfirmPickupContent.pinStep.pinLabel}
        />

        <p className="text-body/70 mt-2 text-sm">
          {ngoConfirmPickupContent.pinStep.pinHelper}
        </p>

        {pinError ? (
          <p className="text-destructive mt-3 text-sm" role="alert">
            {pinError}
          </p>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-6 w-full"
          disabled={!pinComplete}
          onClick={onContinue}
        >
          {ngoConfirmPickupContent.pinStep.continue}
        </Button>
      </article>

      <div className="border-border bg-sand/50 mt-6 flex items-start gap-3 rounded-xl border border-dashed px-4 py-4">
        <span
          aria-hidden="true"
          className="text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold"
        >
          i
        </span>
        <p className="text-body text-sm leading-relaxed">
          {ngoConfirmPickupContent.pinStep.infoBanner}
        </p>
      </div>
    </div>
  )
}
