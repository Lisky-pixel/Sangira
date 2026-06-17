import { GOOGLE_MAPS_SEARCH_BASE, STATIC_MAP_BASE_URL } from '../constants/maps'
import type { Listing } from '../types/listing'

type MapsListing = Pick<Listing, 'pickupAddress' | 'pickupLocation' | 'pickupCoordinates'>

function resolveCoordinates(
  listing: MapsListing,
): [number, number] | undefined {
  return (
    listing.pickupLocation?.coordinates ??
    listing.pickupCoordinates
  )
}

export function buildMapsUrl(listing: MapsListing): string {
  const coordinates = resolveCoordinates(listing)

  if (coordinates) {
    const [lng, lat] = coordinates
    return `${GOOGLE_MAPS_SEARCH_BASE}${lat},${lng}`
  }

  return `${GOOGLE_MAPS_SEARCH_BASE}${encodeURIComponent(
    listing.pickupAddress ?? listing.pickupLocation?.address ?? '',
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
