/** GeoJSON order: [longitude, latitude] */
export type LngLat = readonly [number, number]

const EARTH_RADIUS_KM = 6371

type CoordinatesSource = {
  pickupLocation?: { coordinates?: [number, number] }
  pickupCoordinates?: [number, number]
}

function parseCoordinate(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? null : parsed
  }

  return null
}

export function isValidLngLat(value: unknown): value is LngLat {
  if (!Array.isArray(value) || value.length !== 2) {
    return false
  }

  const lng = parseCoordinate(value[0])
  const lat = parseCoordinate(value[1])

  if (lng === null || lat === null) {
    return false
  }

  return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
}

export function toLngLat(value: unknown): LngLat | null {
  if (!Array.isArray(value) || value.length !== 2) {
    return null
  }

  const lng = parseCoordinate(value[0])
  const lat = parseCoordinate(value[1])

  if (lng === null || lat === null) {
    return null
  }

  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    return null
  }

  return [lng, lat]
}

export function haversineKm(a: LngLat, b: LngLat): number {
  const [lng1, lat1] = a
  const [lng2, lat2] = b
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180

  const deltaLat = toRadians(lat2 - lat1)
  const deltaLng = toRadians(lng2 - lng1)
  const sinLat = Math.sin(deltaLat / 2)
  const sinLng = Math.sin(deltaLng / 2)

  const haversine =
    sinLat * sinLat +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * sinLng * sinLng

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(haversine)))
}

export function formatDistanceKm(km: number): string {
  if (km < 10) {
    return `${km.toFixed(1)} km`
  }

  return `${Math.round(km)} km`
}

export function formatDistanceAway(km: number): string {
  return `${formatDistanceKm(km)} away`
}

export function getListingCoordinates(
  listing: CoordinatesSource,
): LngLat | null {
  const coords =
    listing.pickupLocation?.coordinates ?? listing.pickupCoordinates

  return toLngLat(coords)
}

export function getDistanceForListing(
  ngoCoords: LngLat | null,
  listing: CoordinatesSource,
): number | null {
  const listingCoords = getListingCoordinates(listing)

  if (!ngoCoords || !listingCoords) {
    return null
  }

  return haversineKm(ngoCoords, listingCoords)
}
