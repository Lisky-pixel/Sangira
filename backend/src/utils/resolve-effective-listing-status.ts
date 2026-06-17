import { LISTING_STATUS, type ListingStatus } from '../constants/enums.js'

const NON_EXPIRABLE_STATUSES = new Set<ListingStatus>([
  LISTING_STATUS.MATCHED,
  LISTING_STATUS.COMPLETED,
  LISTING_STATUS.EXPIRED,
  LISTING_STATUS.CANCELLED,
])

export function resolveEffectiveListingStatus(
  status: ListingStatus,
  expiresAt: Date,
  now = new Date(),
): ListingStatus {
  if (NON_EXPIRABLE_STATUSES.has(status)) {
    return status
  }

  if (status === LISTING_STATUS.ACTIVE && expiresAt.getTime() <= now.getTime()) {
    return LISTING_STATUS.EXPIRED
  }

  return status
}

export function isListingExpiredByTime(
  expiresAt: Date,
  now = new Date(),
): boolean {
  return expiresAt.getTime() <= now.getTime()
}
