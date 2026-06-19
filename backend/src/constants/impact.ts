export const DONOR_IMPACT = {
  MONTHLY_SERIES_LENGTH: 6,
} as const

export const DONOR_DASHBOARD_ACTIVITY = {
  RECENT_LIMIT: 5,
  LISTING_LOOKBACK: 50,
  REQUEST_LOOKBACK: 50,
} as const

export const NEEDS_ACTION_LIMIT = 2

export const DONOR_ACTIVITY_PAGE = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
} as const

export const DONOR_ACTIVITY_TYPE = {
  LISTING_POSTED: 'listing_posted',
  REQUEST_RECEIVED: 'request_received',
  REQUEST_ACCEPTED: 'request_accepted',
  TRANSFER_COMPLETED: 'transfer_completed',
  LISTING_EXPIRED: 'listing_expired',
} as const

export type DonorActivityType =
  (typeof DONOR_ACTIVITY_TYPE)[keyof typeof DONOR_ACTIVITY_TYPE]
