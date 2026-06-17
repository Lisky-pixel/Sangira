import { LISTING_STATUS, type ListingStatus } from '../constants/listing-status'
import {
  MY_LISTINGS_TAB,
  type MyListingsTab,
} from '../constants/my-listings'
import { isPastListingExpiry } from './listing-expiry'
import type { Listing } from '../types/listing'

export function resolveListingTabStatus(
  listing: Listing,
): ListingStatus | typeof LISTING_STATUS.REQUESTED {
  if (listing.status === LISTING_STATUS.CANCELLED) {
    return LISTING_STATUS.CANCELLED
  }

  if (listing.status === LISTING_STATUS.MATCHED) {
    return LISTING_STATUS.AWAITING_PICKUP
  }

  if (listing.status === LISTING_STATUS.COMPLETED) {
    return LISTING_STATUS.COMPLETED
  }

  if (
    listing.status === LISTING_STATUS.EXPIRED ||
    (listing.status === LISTING_STATUS.ACTIVE &&
      isPastListingExpiry(listing.expiresAt))
  ) {
    return LISTING_STATUS.EXPIRED
  }

  if (
    listing.status === LISTING_STATUS.ACTIVE &&
    (listing.pendingRequestCount ?? 0) > 0
  ) {
    return LISTING_STATUS.REQUESTED
  }

  return listing.status
}

const ONGOING_DISPLAY_STATUSES = new Set<
  ListingStatus | typeof LISTING_STATUS.REQUESTED
>([
  LISTING_STATUS.ACTIVE,
  LISTING_STATUS.REQUESTED,
  LISTING_STATUS.AWAITING_PICKUP,
])

export function isOngoingListing(listing: Listing): boolean {
  if (listing.status === LISTING_STATUS.CANCELLED) {
    return false
  }

  return ONGOING_DISPLAY_STATUSES.has(resolveListingTabStatus(listing))
}

/** Cancelled listings are hidden from all My-listings tabs for now */
export function isHiddenListing(listing: Listing): boolean {
  return resolveListingTabStatus(listing) === LISTING_STATUS.CANCELLED
}

export function filterVisibleListings(listings: Listing[]): Listing[] {
  return listings.filter((listing) => !isHiddenListing(listing))
}

export function filterOngoingListings(listings: Listing[]): Listing[] {
  return listings.filter(isOngoingListing)
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
