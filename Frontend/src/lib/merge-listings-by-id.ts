import { filterVisibleListings, isHiddenListing } from './my-listings-filters'
import type { Listing } from '../types/listing'

/** Merge server and local listings by _id; server copy wins on conflict. */
export function mergeListingsById(
  current: Listing[],
  fetched: Listing[],
): Listing[] {
  const byId = new Map<string, Listing>()

  for (const listing of current) {
    byId.set(listing._id, listing)
  }

  for (const listing of fetched) {
    byId.set(listing._id, listing)
  }

  return filterVisibleListings(
    Array.from(byId.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  )
}

export function isRenderableListing(value: unknown): value is Listing {
  if (!value || typeof value !== 'object') {
    return false
  }

  const listing = value as Listing
  return (
    typeof listing._id === 'string' &&
    typeof listing.createdAt === 'string' &&
    !isHiddenListing(listing)
  )
}
