import { config } from '../../config/env.js'
import {
  GEOCODER_USER_AGENT_APP,
  GEOCODER_USER_AGENT_VERSION,
  NOMINATIM_BASE_URL,
  NOMINATIM_COUNTRY_BIAS,
  NOMINATIM_REQUEST_TIMEOUT_MS,
} from '../../constants/geocoder.js'
import type { GeocodeResult } from './types.js'

type NominatimSearchResult = {
  lat: string
  lon: string
}

function buildNominatimUserAgent() {
  return `${GEOCODER_USER_AGENT_APP}/${GEOCODER_USER_AGENT_VERSION} (${config.EMAIL_FROM_ADDRESS})`
}

export async function geocodeWithNominatim(
  address: string,
): Promise<GeocodeResult> {
  const trimmed = address.trim()
  if (!trimmed) {
    return null
  }

  const params = new URLSearchParams({
    q: trimmed,
    format: 'json',
    limit: '1',
    countrycodes: NOMINATIM_COUNTRY_BIAS,
  })

  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    NOMINATIM_REQUEST_TIMEOUT_MS,
  )

  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': buildNominatimUserAgent(),
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      return null
    }

    const results = (await response.json()) as NominatimSearchResult[]
    const match = results[0]
    if (!match) {
      return null
    }

    const lat = Number.parseFloat(match.lat)
    const lng = Number.parseFloat(match.lon)

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return null
    }

    return { lat, lng }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}
