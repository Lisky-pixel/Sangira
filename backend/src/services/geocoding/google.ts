import { config } from '../../config/env.js'
import {
  GOOGLE_GEOCODING_BASE_URL,
  GOOGLE_GEOCODING_COUNTRY_COMPONENT,
  GOOGLE_GEOCODING_REGION_BIAS,
  GOOGLE_GEOCODING_REQUEST_TIMEOUT_MS,
  GOOGLE_GEOCODING_STATUS,
  GOOGLE_MAPS_API_KEY_MISSING_MESSAGE,
} from '../../constants/geocoder.js'
import type { GeocodeResult } from './types.js'

type GoogleGeocodeResponse = {
  status: string
  error_message?: string
  results: Array<{
    geometry: {
      location: {
        lat: number
        lng: number
      }
    }
  }>
}

function logGoogleGeocodeFailure(
  status: string,
  address: string,
  errorMessage?: string,
) {
  console.error('Google geocoding API status', {
    status,
    error_message: errorMessage?.trim() || undefined,
    address,
  })
}

function resolveGoogleMapsApiKey(): string {
  const apiKey = config.GOOGLE_MAPS_API_KEY?.trim()

  if (!apiKey) {
    throw new Error(GOOGLE_MAPS_API_KEY_MISSING_MESSAGE)
  }

  return apiKey
}

function buildGoogleGeocodeRequestUrl(address: string, apiKey: string): string {
  const params = new URLSearchParams({
    address,
    key: apiKey,
    region: GOOGLE_GEOCODING_REGION_BIAS,
    components: GOOGLE_GEOCODING_COUNTRY_COMPONENT,
  })

  return `${GOOGLE_GEOCODING_BASE_URL}?${params.toString()}`
}

export async function geocodeWithGoogle(
  address: string,
): Promise<GeocodeResult> {
  const trimmed = address.trim()
  if (!trimmed) {
    return null
  }

  const apiKey = resolveGoogleMapsApiKey()
  const requestUrl = buildGoogleGeocodeRequestUrl(trimmed, apiKey)

  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    GOOGLE_GEOCODING_REQUEST_TIMEOUT_MS,
  )

  try {
    const response = await fetch(requestUrl, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error('Google geocoding HTTP error', {
        httpStatus: response.status,
        address: trimmed,
      })
      return null
    }

    const body = (await response.json()) as GoogleGeocodeResponse

    if (body.status === GOOGLE_GEOCODING_STATUS.OK) {
      const match = body.results[0]
      const lat = match?.geometry.location.lat
      const lng = match?.geometry.location.lng

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return null
      }

      return { lat, lng }
    }

    if (body.status === GOOGLE_GEOCODING_STATUS.ZERO_RESULTS) {
      return null
    }

    logGoogleGeocodeFailure(body.status, trimmed, body.error_message)
    return null
  } catch {
    console.error('Google geocoding request failed', { address: trimmed })
    return null
  } finally {
    clearTimeout(timeout)
  }
}
