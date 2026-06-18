import type { FoodType, StorageCondition } from '../constants/listing-form'
import { ngoBrowseContent } from '../placeholder/ngo-browse-content'
import type { NgoBrowseListing } from '../types/ngo-browse-listing'

export type NgoBrowseFilters = {
  search: string
  foodTypes: FoodType[]
  storageConditions: StorageCondition[]
  expiresToday: boolean
}

export const EMPTY_NGO_BROWSE_FILTERS: NgoBrowseFilters = {
  search: '',
  foodTypes: [],
  storageConditions: [],
  expiresToday: false,
}

export function isExpiresToday(expiresAt: string, now = new Date()): boolean {
  const expiry = new Date(expiresAt)
  if (Number.isNaN(expiry.getTime())) {
    return false
  }

  return (
    expiry.getFullYear() === now.getFullYear() &&
    expiry.getMonth() === now.getMonth() &&
    expiry.getDate() === now.getDate()
  )
}

function matchesSearch(listing: NgoBrowseListing, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  const foodTypeLabel =
    ngoBrowseContent.foodTypeLabels[listing.foodType].toLowerCase()
  const donorName = listing.donor.organisationName.toLowerCase()

  return (
    foodTypeLabel.includes(normalized) ||
    donorName.includes(normalized) ||
    listing.title.toLowerCase().includes(normalized)
  )
}

export function filterNgoBrowseListings(
  listings: NgoBrowseListing[],
  filters: NgoBrowseFilters,
): NgoBrowseListing[] {
  return listings.filter((listing) => {
    if (!matchesSearch(listing, filters.search)) {
      return false
    }

    if (
      filters.foodTypes.length > 0 &&
      !filters.foodTypes.includes(listing.foodType)
    ) {
      return false
    }

    if (
      filters.storageConditions.length > 0 &&
      !filters.storageConditions.includes(listing.storageCondition)
    ) {
      return false
    }

    if (filters.expiresToday && !isExpiresToday(listing.expiresAt)) {
      return false
    }

    return true
  })
}

export function toggleFilterValue<T extends string>(
  values: T[],
  value: T,
): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}
