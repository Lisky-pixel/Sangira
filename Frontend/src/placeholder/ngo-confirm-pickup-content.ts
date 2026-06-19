import type { QuantityUnit } from '../constants/listing-form'
import { formatPickupByTime } from '../lib/format-listing-time'
import { postListingContent } from './post-listing-content'

export const ngoConfirmPickupContent = {
  loading: 'Loading pickup details…',
  loadError: 'Could not load this pickup.',
  backToRequests: '← Back to my requests',
  pinStep: {
    title: (donorName: string) => `Confirm pickup from ${donorName}`,
    verifiedLabel: 'Verified',
    listingSummary: (input: {
      title: string
      quantity: number
      quantityUnit: QuantityUnit
      expiresAt: string
    }) => {
      const unitLabel = postListingContent.quantityUnitLabels[input.quantityUnit]
      const pickupTime = formatPickupByTime(input.expiresAt)
      return `${input.title} — ${input.quantity} ${unitLabel} · Pick up by ${pickupTime}`
    },
    scanQr: "Scan donor's QR code",
    scanQrDeferred: 'QR scanning is coming soon.',
    divider: 'or',
    pinLabel: 'Enter the 6-digit PIN from the donor',
    pinHelper: 'The donor shows this code on their screen.',
    continue: 'Continue',
    infoBanner:
      'Verifying the pickup creates an accurate record of the donation for both you and the donor.',
    pinError: 'Incorrect PIN. Check the code on the donor’s screen and try again.',
    tooManyAttempts: 'Too many incorrect attempts. Please try again later.',
  },
  conditionStep: {
    verifiedStrip: 'Code verified',
    title: 'Confirm what you received',
    fromDonor: (donorName: string) => `From ${donorName}`,
    conditionLabel: 'Condition of the food',
    conditions: {
      as_described: 'Received as described',
      partial: 'Partial quantity',
      issue: 'Issue with the food',
    },
    noteLabel: 'Add a note (optional)',
    notePlaceholder: 'e.g. received 25 of 30 servings',
    confirmButton: 'Confirm food received',
    confirmSubcopy: 'This completes the transfer for both you and the donor.',
    confirmToast: {
      loading: 'Confirming receipt…',
      success: 'Pickup confirmed — transfer complete.',
      error: 'Could not confirm receipt. Please try again.',
    },
  },
  completion: {
    pill: 'Transfer complete',
    heading: 'Pickup confirmed',
    receiptLine: (input: {
      title: string
      quantity: number
      quantityUnit: QuantityUnit
      donorName: string
    }) => {
      const unitLabel =
        postListingContent.quantityUnitLabels[input.quantityUnit]
      const listingLine = `${input.title} — ${input.quantity} ${unitLabel}`
      return `You confirmed receipt of ${listingLine} from ${input.donorName}.`
    },
    impactMeals: (count: number) =>
      `+${count} meals to your beneficiaries this week`,
    impactItems: (count: number) =>
      `+${count} items to your beneficiaries this week`,
    impactKg: (count: number) =>
      `${count} kg to your beneficiaries this week`,
    viewRequests: 'View my requests',
    browseMore: 'Browse more food',
  },
} as const
