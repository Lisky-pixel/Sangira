const RWANDA_PATTERN = /\brwanda\b/i
const STREET_ABBREVIATION_PATTERN = /\bSt\.?\b/gi
const KG_STREET_PATTERN = /\bKG(\d+)/gi

/** Conservative normalization before Nominatim — no arbitrary typo fixes. */
export function normalizeGeocodeAddress(address: string): string {
  let normalized = address.trim().replace(/\s+/g, ' ')
  normalized = normalized.replace(/\s*,\s*/g, ', ')
  normalized = normalized.replace(/,\s*,+/g, ', ')
  normalized = normalized.replace(STREET_ABBREVIATION_PATTERN, 'Street')
  normalized = normalized.replace(KG_STREET_PATTERN, 'KG $1')

  if (!RWANDA_PATTERN.test(normalized)) {
    normalized = `${normalized}, Rwanda`
  }

  return normalized.trim()
}
