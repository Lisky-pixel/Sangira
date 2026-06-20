import { LISTING_STATUS, type ListingStatus } from '../constants/enums.js'
import {
  ADMIN_LISTING_DISPLAY_STATUS,
  ADMIN_LISTING_STATUS_FILTER,
  type AdminListingDisplayStatus,
} from '../constants/admin-listings.js'
import { resolveEffectiveListingStatus } from './resolve-effective-listing-status.js'

export function resolveAdminListingDisplayStatus(
  status: ListingStatus,
  expiresAt: Date,
  now = new Date(),
): AdminListingDisplayStatus | null {
  if (status === LISTING_STATUS.CANCELLED) {
    return null
  }

  const effective = resolveEffectiveListingStatus(status, expiresAt, now)

  if (effective === LISTING_STATUS.MATCHED) {
    return ADMIN_LISTING_DISPLAY_STATUS.AWAITING_PICKUP
  }

  if (effective === LISTING_STATUS.COMPLETED) {
    return ADMIN_LISTING_DISPLAY_STATUS.COMPLETED
  }

  if (effective === LISTING_STATUS.EXPIRED) {
    return ADMIN_LISTING_DISPLAY_STATUS.EXPIRED
  }

  if (effective === LISTING_STATUS.ACTIVE) {
    return ADMIN_LISTING_DISPLAY_STATUS.ACTIVE
  }

  return null
}

export function buildAdminListingStatusMongoFilter(
  statusFilter: string,
  now = new Date(),
): Record<string, unknown> {
  const visible = { status: { $ne: LISTING_STATUS.CANCELLED } }

  switch (statusFilter) {
    case ADMIN_LISTING_STATUS_FILTER.ACTIVE:
      return {
        ...visible,
        status: LISTING_STATUS.ACTIVE,
        expiresAt: { $gt: now },
      }
    case ADMIN_LISTING_STATUS_FILTER.AWAITING_PICKUP:
      return {
        ...visible,
        status: LISTING_STATUS.MATCHED,
      }
    case ADMIN_LISTING_STATUS_FILTER.COMPLETED:
      return {
        ...visible,
        status: LISTING_STATUS.COMPLETED,
      }
    case ADMIN_LISTING_STATUS_FILTER.EXPIRED:
      return {
        ...visible,
        $or: [
          { status: LISTING_STATUS.EXPIRED },
          {
            status: LISTING_STATUS.ACTIVE,
            expiresAt: { $lte: now },
          },
        ],
      }
    default:
      return visible
  }
}
