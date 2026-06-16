export const COUNTRY_CODE = '+250' as const
export const DEFAULT_COUNTRY = 'RW' as const

/** Rwanda-specific: 9-digit mobile numbers (leading 7). */
export const RWANDA_MOBILE_REGEX = /^7\d{8}$/

function stripSeparators(input: string) {
  return input.trim().replace(/[\s()-]/g, '')
}

/**
 * Converts common Rwanda phone inputs into canonical E.164.
 *
 * Accepts:
 * - "+250 78X XXX XXX"
 * - "250788000000"
 * - "0788000000"
 * - "788000000"
 * (also with spaces/dashes/parentheses)
 *
 * Returns "+250" + 9 digits, or null if invalid.
 */
export function normalizePhone(input: string): string | null {
  const raw = stripSeparators(input)
  if (!raw) return null

  let national: string | undefined

  if (raw.startsWith(COUNTRY_CODE)) {
    national = raw.slice(COUNTRY_CODE.length)
  } else if (raw.startsWith('250')) {
    national = raw.slice(3)
  } else if (raw.startsWith('0')) {
    national = raw.slice(1)
  } else if (/^\d{9}$/.test(raw)) {
    national = raw
  } else {
    return null
  }

  if (!national || !/^\d{9}$/.test(national)) return null

  return `${COUNTRY_CODE}${national}`
}

export function isValidRwandanMobile(input: string): boolean {
  const normalized = normalizePhone(input)
  if (!normalized) return false
  const national = normalized.slice(COUNTRY_CODE.length)
  return RWANDA_MOBILE_REGEX.test(national)
}
