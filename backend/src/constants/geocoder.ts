export const GEOCODER_PROVIDER = {
  NOMINATIM: 'nominatim',
  GOOGLE: 'google',
} as const

export type GeocoderProvider =
  (typeof GEOCODER_PROVIDER)[keyof typeof GEOCODER_PROVIDER]

export const GEOCODER_PROVIDER_VALUES = Object.values(GEOCODER_PROVIDER) as [
  GeocoderProvider,
  ...GeocoderProvider[],
]

export const NOMINATIM_BASE_URL =
  'https://nominatim.openstreetmap.org/search'

export const NOMINATIM_COUNTRY_BIAS = 'rw'

export const NOMINATIM_REQUEST_TIMEOUT_MS = 8_000

/** Minimum delay between Nominatim calls — respect OSM usage policy */
export const NOMINATIM_MIN_INTERVAL_MS = 1_100

export const GEOCODER_USER_AGENT_APP = 'Sangira'

export const GEOCODER_USER_AGENT_VERSION = '1.0'

/** Nominatim viewbox bias for Kigali metro — left, top, right, bottom (lon/lat) */
export const NOMINATIM_KIGALI_VIEWBOX = '30.0,-1.85,30.2,-2.05'

export const GOOGLE_GEOCODING_BASE_URL =
  'https://maps.googleapis.com/maps/api/geocode/json'

export const GOOGLE_GEOCODING_REGION_BIAS = 'rw'

export const GOOGLE_GEOCODING_COUNTRY_COMPONENT = 'country:RW'

export const GOOGLE_GEOCODING_REQUEST_TIMEOUT_MS = 8_000

/** Pause between backfill geocode calls — avoid burst quota usage */
export const GOOGLE_GEOCODE_BACKFILL_DELAY_MS = 200

export const GOOGLE_GEOCODING_STATUS = {
  OK: 'OK',
  ZERO_RESULTS: 'ZERO_RESULTS',
  OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
  REQUEST_DENIED: 'REQUEST_DENIED',
  INVALID_REQUEST: 'INVALID_REQUEST',
} as const

export const GOOGLE_MAPS_API_KEY_MISSING_MESSAGE =
  'GOOGLE_MAPS_API_KEY is required when GEOCODER=google. Set it in backend/.env (never commit the key).'
