export const ROLES = {
  DONOR: 'donor',
  NGO: 'ngo',
  ADMIN: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_VALUES = Object.values(ROLES)

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  FLAGGED: 'flagged',
  SUSPENDED: 'suspended',
  REVOKED: 'revoked',
} as const

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS]

export const ACCOUNT_STATUS_VALUES = Object.values(ACCOUNT_STATUS)

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS]

export const VERIFICATION_STATUS_VALUES = Object.values(VERIFICATION_STATUS)

export const LISTING_STATUS = {
  ACTIVE: 'active',
  MATCHED: 'matched',
  EXPIRED: 'expired',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type ListingStatus =
  (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS]

export const LISTING_STATUS_VALUES = Object.values(LISTING_STATUS)

export const REQUEST_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS]

export const REQUEST_STATUS_VALUES = Object.values(REQUEST_STATUS)

export const NOTIFICATION_TYPE = {
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  NEW_MATCH: 'new_match',
  REQUEST_ACCEPTED: 'request_accepted',
  REQUEST_DECLINED: 'request_declined',
  PICKUP_REMINDER: 'pickup_reminder',
  PICKUP_CONFIRMED: 'pickup_confirmed',
  LISTING_EXPIRED: 'listing_expired',
  ACCOUNT_FLAGGED: 'account_flagged',
  ACCOUNT_SUSPENDED: 'account_suspended',
} as const

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

export const NOTIFICATION_TYPE_VALUES = Object.values(NOTIFICATION_TYPE)

export const NGO_SECTOR = {
  ORPHANAGE: 'orphanage',
  SHELTER: 'shelter',
  COMMUNITY_CENTRE: 'community_centre',
} as const

export type NgoSector = (typeof NGO_SECTOR)[keyof typeof NGO_SECTOR]

export const NGO_SECTOR_VALUES = Object.values(NGO_SECTOR)

/** Rate-limit ceilings — imported by middleware, not inlined */
export const RATE_LIMIT = {
  GLOBAL_WINDOW_MS: 15 * 60 * 1000,
  GLOBAL_MAX: 200,
  STRICT_WINDOW_MS: 15 * 60 * 1000,
  STRICT_MAX: 20,
  DEV_WINDOW_MS: 15 * 60 * 1000,
  DEV_MAX: 5,
} as const
