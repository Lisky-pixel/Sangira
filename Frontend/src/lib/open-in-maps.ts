import { GOOGLE_MAPS_SEARCH_BASE, STATIC_MAP_BASE_URL } from '../constants/maps'
import type { Listing } from '../types/listing'

type MapsListing = Pick<Listing, 'pickupAddress' | 'pickupCoordinates'>

export function buildMapsUrl(listing: MapsListing): string {
  if (listing.pickupCoordinates) {
    const [lng, lat] = listing.pickupCoordinates
    return `${GOOGLE_MAPS_SEARCH_BASE}${lat},${lng}`
  }

  return `${GOOGLE_MAPS_SEARCH_BASE}${encodeURIComponent(
    listing.pickupAddress ?? '',
  )}`
}

export function openInMaps(listing: MapsListing): void {
  window.open(buildMapsUrl(listing), '_blank', 'noopener,noreferrer')
}

export function buildStaticMapUrl(
  coordinates: [number, number],
  width: number,
  height: number,
): string {
  const [lng, lat] = coordinates
  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: '15',
    size: `${width}x${height}`,
    markers: `${lat},${lng},red`,
  })

  return `${STATIC_MAP_BASE_URL}?${params.toString()}`
}
