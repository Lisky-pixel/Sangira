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
