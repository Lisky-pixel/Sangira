export const DEFAULT_COUNTRY_CODE = '+250'

/** Rwanda-specific: 9-digit mobile numbers (leading 7). // TODO: multi-country support */
export const RWANDA_MOBILE_DIGIT_COUNT = 9
export const RWANDA_MOBILE_REGEX = /^7\d{8}$/

export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, RWANDA_MOBILE_DIGIT_COUNT)
}
