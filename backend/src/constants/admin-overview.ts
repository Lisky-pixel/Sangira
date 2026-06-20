export const ADMIN_RECENT_ACTIVITY_LIMIT = 8

export const ADMIN_FLAGS_LIMIT = 5

export const ADMIN_OVERVIEW_PENDING_URGENT_HOURS = 48

export const ADMIN_OVERVIEW_STUCK_HANDOVER_HOURS = 24

export const ADMIN_OVERVIEW_RECENT_ACTIVITY_LIMIT = ADMIN_RECENT_ACTIVITY_LIMIT

export const ADMIN_OVERVIEW_FLAGS_LIMIT = ADMIN_FLAGS_LIMIT

export const ADMIN_OVERVIEW_ACTIVITY_LOOKBACK_DAYS = 90

export const ADMIN_OVERVIEW_ACTIVITY_PER_SOURCE_LIMIT = 20

export const ADMIN_OVERVIEW_ACTIVITY_TYPE = {
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  LISTING_POSTED: 'listing_posted',
  TRANSFER_COMPLETED: 'transfer_completed',
  REGISTRATION_PENDING: 'registration_pending',
  LISTING_EXPIRED_UNMATCHED: 'listing_expired_unmatched',
} as const

export type AdminOverviewActivityType =
  (typeof ADMIN_OVERVIEW_ACTIVITY_TYPE)[keyof typeof ADMIN_OVERVIEW_ACTIVITY_TYPE]

export const ADMIN_OVERVIEW_FLAG_TYPE = {
  STUCK_HANDOVERS: 'stuck_handovers',
  UNMATCHED_EXPIRIES: 'unmatched_expiries',
} as const

export type AdminOverviewFlagType =
  (typeof ADMIN_OVERVIEW_FLAG_TYPE)[keyof typeof ADMIN_OVERVIEW_FLAG_TYPE]

/** Admin portal paths returned for flag review links (mirror frontend ROUTES). */
export const ADMIN_OVERVIEW_FLAG_REVIEW_PATH = {
  LISTINGS: '/admin/listings',
} as const
