export const ADMIN_RECENT_ACTIVITY_LIMIT = 8

export const ADMIN_FLAGS_LIMIT = 5

export const ADMIN_ACTIVITY_PAGE_SIZE = 20

export const ADMIN_OVERVIEW_ACTIVITY_TYPE = {
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  LISTING_POSTED: 'listing_posted',
  TRANSFER_COMPLETED: 'transfer_completed',
  REGISTRATION_PENDING: 'registration_pending',
  LISTING_EXPIRED_UNMATCHED: 'listing_expired_unmatched',
} as const

export const ADMIN_OVERVIEW_FLAG_TYPE = {
  STUCK_HANDOVERS: 'stuck_handovers',
  UNMATCHED_EXPIRIES: 'unmatched_expiries',
} as const
