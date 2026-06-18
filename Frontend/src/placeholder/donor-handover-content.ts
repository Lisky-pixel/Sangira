import type { QuantityUnit } from '../constants/listing-form'
import { formatPickupByTime } from '../lib/format-listing-time'
import { postListingContent } from './post-listing-content'

export const donorHandoverContent = {
  loading: 'Loading handover…',
  loadError: 'Could not load this handover.',
  backToListing: '← Back to listing',
  handoverTitle: (ngoName: string) => `Handover to ${ngoName}`,
  verifiedLabel: 'Verified',
  listingSummary: (input: {
    title: string
    quantity: number
    quantityUnit: QuantityUnit
    expiresAt: string
  }) => {
    const unitLabel = postListingContent.quantityUnitLabels[input.quantityUnit]
    const pickupTime = formatPickupByTime(input.expiresAt)
    return `${input.title} — ${input.quantity} ${unitLabel} · Pickup by ${pickupTime}`
  },
  qr: {
    pinFallback: "OR SHARE THIS PIN IF THE NGO CAN'T SCAN",
  },
  checklist: {
    foodReady: 'Food is packed and ready',
    ngoArrived: 'NGO representative has arrived',
  },
  confirmButton: 'Confirm handover',
  confirmToast: {
    loading: 'Confirming handover…',
    success: 'Handover confirmed — waiting for NGO receipt.',
    error: 'Could not confirm handover. Please try again.',
  },
  waiting: {
    pill: 'Waiting for NGO confirmation',
    message: (ngoName: string) =>
      `The transfer completes when ${ngoName} confirms receipt.`,
  },
  completion: {
    pill: 'TRANSFER COMPLETE',
    heading: 'Handover confirmed',
    receiptLine: (ngoName: string, listingLine: string) =>
      `${ngoName} confirmed receipt of ${listingLine}.`,
    impactMeals: (count: number) => `+${count} meals redistributed`,
    impactKg: (count: number) => `${count} kg waste prevented`,
    impactItems: (count: number) => `+${count} items redistributed`,
    viewListings: 'View my listings',
    postAnother: 'Post another listing',
  },
} as const
