/** Native maps deep-link base — no SDK, no API key */
export const GOOGLE_MAPS_SEARCH_BASE = 'https://maps.google.com/?q='

/**
 * Static map thumbnail provider.
 * TODO: confirm static-map source before production.
 */
export const STATIC_MAP_BASE_URL =
  'https://staticmap.openstreetmap.de/staticmap.php'

export const STATIC_MAP_DEFAULT_SIZE = {
  width: 640,
  height: 240,
} as const
