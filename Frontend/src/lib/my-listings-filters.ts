import { LISTING_STATUS, type ListingStatus } from '../constants/listing-status'
import {
  MY_LISTINGS_TAB,
  type MyListingsTab,
} from '../constants/my-listings'
import type { Listing } from '../types/listing'

export function resolveListingTabStatus(
  listing: Listing,
): ListingStatus | typeof LISTING_STATUS.REQUESTED {
  if (listing.status === LISTING_STATUS.MATCHED) {
    return LISTING_STATUS.AWAITING_PICKUP
  }

  if (
    listing.status === LISTING_STATUS.ACTIVE &&
    (listing.pendingRequestCount ?? 0) > 0
  ) {
    return LISTING_STATUS.REQUESTED
  }

  return listing.status
}

export function listingBelongsToTab(
  listing: Listing,
  tab: MyListingsTab,
): boolean {
  const displayStatus = resolveListingTabStatus(listing)

  switch (tab) {
    case MY_LISTINGS_TAB.ACTIVE:
      return (
        displayStatus === LISTING_STATUS.ACTIVE ||
        displayStatus === LISTING_STATUS.REQUESTED
      )
    case MY_LISTINGS_TAB.AWAITING_PICKUP:
      return displayStatus === LISTING_STATUS.AWAITING_PICKUP
    case MY_LISTINGS_TAB.COMPLETED:
      return displayStatus === LISTING_STATUS.COMPLETED
    case MY_LISTINGS_TAB.EXPIRED:
      return displayStatus === LISTING_STATUS.EXPIRED
    default:
      return false
  }
}

export function filterListingsByTab(
  listings: Listing[],
  tab: MyListingsTab,
): Listing[] {
  return listings.filter((listing) => listingBelongsToTab(listing, tab))
}

export function countListingsByTab(
  listings: Listing[],
  tab: MyListingsTab,
): number {
  return filterListingsByTab(listings, tab).length
}

export function countAllTabs(listings: Listing[]) {
  return {
    [MY_LISTINGS_TAB.ACTIVE]: countListingsByTab(
      listings,
      MY_LISTINGS_TAB.ACTIVE,
    ),
    [MY_LISTINGS_TAB.AWAITING_PICKUP]: countListingsByTab(
      listings,
      MY_LISTINGS_TAB.AWAITING_PICKUP,
    ),
    [MY_LISTINGS_TAB.COMPLETED]: countListingsByTab(
      listings,
      MY_LISTINGS_TAB.COMPLETED,
    ),
    [MY_LISTINGS_TAB.EXPIRED]: countListingsByTab(
      listings,
      MY_LISTINGS_TAB.EXPIRED,
    ),
  }
}
