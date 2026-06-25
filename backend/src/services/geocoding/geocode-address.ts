import { config } from '../../config/env.js'
import {
  GEOCODER_PROVIDER,
  NOMINATIM_MIN_INTERVAL_MS,
} from '../../constants/geocoder.js'
import { normalizeGeocodeAddress } from '../../utils/normalize-geocode-address.js'
import { geocodeWithGoogle } from './google.js'
import { geocodeWithNominatim } from './nominatim.js'
import type { GeocodeResult } from './types.js'

let lastNominatimCallAt = 0

async function rateLimitedNominatim(address: string): Promise<GeocodeResult> {
  const elapsed = Date.now() - lastNominatimCallAt
  if (elapsed < NOMINATIM_MIN_INTERVAL_MS) {
    await new Promise((resolve) => {
      setTimeout(resolve, NOMINATIM_MIN_INTERVAL_MS - elapsed)
    })
  }

  lastNominatimCallAt = Date.now()
  return geocodeWithNominatim(address)
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const trimmed = address.trim()
  if (!trimmed) {
    return null
  }

  const normalized = normalizeGeocodeAddress(trimmed)

  if (config.GEOCODER === GEOCODER_PROVIDER.GOOGLE) {
    return geocodeWithGoogle(normalized)
  }

  return rateLimitedNominatim(normalized)
}
