import { LISTING_STATUS } from '../constants/listing-status'
import { resolveListingTabStatus } from './my-listings-filters'
import type { Listing } from '../types/listing'
import type { StatusChipVariant } from '../components/ui/status-chip'

export function getStatusChipVariant(listing: Listing): StatusChipVariant {
  const displayStatus = resolveListingTabStatus(listing)

  switch (displayStatus) {
    case LISTING_STATUS.REQUESTED:
      return 'requested'
    case LISTING_STATUS.AWAITING_PICKUP:
      return 'awaiting_pickup'
    case LISTING_STATUS.COMPLETED:
      return 'completed'
    case LISTING_STATUS.EXPIRED:
    case LISTING_STATUS.CANCELLED:
      return 'expired'
    default:
      return 'active'
  }
}

export function canEditListing(listing: Listing): boolean {
  return resolveListingTabStatus(listing) === LISTING_STATUS.ACTIVE
}

export function canCancelListing(listing: Listing): boolean {
  const displayStatus = resolveListingTabStatus(listing)
  return (
    displayStatus === LISTING_STATUS.ACTIVE ||
    displayStatus === LISTING_STATUS.REQUESTED
  )
}

export function shouldShowCountdownChip(listing: Listing): boolean {
  const displayStatus = resolveListingTabStatus(listing)
  return (
    displayStatus === LISTING_STATUS.ACTIVE ||
    displayStatus === LISTING_STATUS.REQUESTED
  )
}
