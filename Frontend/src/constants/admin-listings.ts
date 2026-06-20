export const ADMIN_LISTINGS_PAGE = {
  PAGE_SIZE: 10,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const

export const ADMIN_LISTING_DISPLAY_STATUS = {
  ACTIVE: 'active',
  AWAITING_PICKUP: 'awaiting_pickup',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
} as const

export type AdminListingDisplayStatus =
  (typeof ADMIN_LISTING_DISPLAY_STATUS)[keyof typeof ADMIN_LISTING_DISPLAY_STATUS]

export const ADMIN_LISTING_STATUS_FILTER = {
  ALL: 'all',
  ACTIVE: 'active',
  AWAITING_PICKUP: 'awaiting_pickup',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
} as const

export type AdminListingStatusFilter =
  (typeof ADMIN_LISTING_STATUS_FILTER)[keyof typeof ADMIN_LISTING_STATUS_FILTER]

export const ADMIN_LISTING_STATUS_FILTER_ORDER = [
  ADMIN_LISTING_STATUS_FILTER.ALL,
  ADMIN_LISTING_STATUS_FILTER.ACTIVE,
  ADMIN_LISTING_STATUS_FILTER.AWAITING_PICKUP,
  ADMIN_LISTING_STATUS_FILTER.COMPLETED,
  ADMIN_LISTING_STATUS_FILTER.EXPIRED,
] as const
