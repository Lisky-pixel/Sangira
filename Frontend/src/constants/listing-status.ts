/** Mirrors backend LISTING_STATUS — swap via shared constants only */
export const LISTING_STATUS = {
  ACTIVE: 'active',
  MATCHED: 'matched',
  EXPIRED: 'expired',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type ListingStatus =
  (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS]
