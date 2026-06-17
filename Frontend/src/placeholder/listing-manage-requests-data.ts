/**
 * PLACEHOLDER — demo NGO requests for the manage listing screen.
 * TODO: replace with live data from the Request model when the NGO portal ships.
 */
export type PlaceholderListingRequest = {
  id: string
  ngoName: string
  capacityMeals: number
  distanceKm: number
  requestedMinutesAgo: number
}

const PLACEHOLDER_LISTING_REQUESTS: PlaceholderListingRequest[] = [
  {
    id: 'placeholder-st-joseph',
    ngoName: 'St. Joseph Orphanage',
    capacityMeals: 120,
    distanceKm: 1.8,
    requestedMinutesAgo: 15,
  },
  {
    id: 'placeholder-hope-shelter',
    ngoName: 'Hope Shelter Kigali',
    capacityMeals: 60,
    distanceKm: 3.2,
    requestedMinutesAgo: 40,
  },
]

/** PLACEHOLDER boundary — swap this function when Request API ships */
export function getPlaceholderListingRequests(listingId: string): PlaceholderListingRequest[] {
  void listingId
  return PLACEHOLDER_LISTING_REQUESTS
}
