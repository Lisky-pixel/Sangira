import { COUNTRY_CODE } from '../constants/phone'

/**
 * Masks a Rwanda mobile number for display — never shows full digits.
 * Example: 788123456 → "+250 78x xxx xxx"
 */
export function maskPhone(
  phone: string,
  countryCode: string = COUNTRY_CODE,
): string {
  const digits = phone.replace(/\D/g, '').slice(-9)

  if (digits.length < 2) {
    return `${countryCode} xxx xxx xxx`
  }

  const visiblePrefix = digits.slice(0, 2)

  return `${countryCode} ${visiblePrefix}x xxx xxx`
}
