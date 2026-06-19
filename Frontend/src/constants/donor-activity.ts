/** Mirrors backend DONOR_ACTIVITY_TYPE */
export const DONOR_ACTIVITY_TYPE = {
  LISTING_POSTED: 'listing_posted',
  REQUEST_RECEIVED: 'request_received',
  REQUEST_ACCEPTED: 'request_accepted',
  TRANSFER_COMPLETED: 'transfer_completed',
  LISTING_EXPIRED: 'listing_expired',
} as const

export type DonorActivityType =
  (typeof DONOR_ACTIVITY_TYPE)[keyof typeof DONOR_ACTIVITY_TYPE]

/** Donor activity feed — dashboard preview + full Activity page */
export const DONOR_RECENT_ACTIVITY_LIMIT = 5

export const DONOR_ACTIVITY_PAGE_SIZE = 20
