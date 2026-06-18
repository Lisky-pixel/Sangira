import type { Listing } from '../types/listing'
import { isRenderableListing } from '../lib/merge-listings-by-id'

export const MY_LISTINGS_LOCATION_STATE = {
  CREATED_LISTING: 'createdListing',
} as const

export type MyListingsLocationState = {
  [MY_LISTINGS_LOCATION_STATE.CREATED_LISTING]?: Listing
}

export function getCreatedListingFromLocationState(
  state: unknown,
): Listing | null {
  if (!state || typeof state !== 'object') {
    return null
  }

  const createdListing = (state as MyListingsLocationState)[
    MY_LISTINGS_LOCATION_STATE.CREATED_LISTING
  ]

  return isRenderableListing(createdListing) ? createdListing : null
}
