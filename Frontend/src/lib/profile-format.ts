import { COUNTRY_CODE } from '../constants/phone'

export function getOrganisationInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'

  if (words.length === 1) {
    return words[0]!.slice(0, 2).toUpperCase()
  }

  return `${words[0]![0] ?? ''}${words[1]![0] ?? ''}`.toUpperCase()
}

export function formatMemberMonthYear(iso: string | Date | undefined): string {
  if (!iso) return ''
  const date = iso instanceof Date ? iso : new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortMonthYear(iso: string | Date | undefined): string {
  if (!iso) return ''
  const date = iso instanceof Date ? iso : new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })
}

export function formatProfileLocation(address: string | undefined): string {
  const trimmed = address?.trim()
  if (!trimmed) return ''

  const parts = trimmed.split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
  }

  return trimmed
}

export function maskPhoneForDisplay(phone: string | undefined): string {
  if (!phone) return ''

  const digits = phone.replace(/\D/g, '')
  if (digits.length < 12) return phone

  const national = digits.startsWith('250') ? digits.slice(3) : digits.slice(-9)
  if (national.length !== 9) return phone

  return `${COUNTRY_CODE} ${national.slice(0, 2)}x xxx ${national.slice(-3)}`
}

export function formatPasswordLastChanged(
  iso: string | Date | undefined,
): string | null {
  if (!iso) return null
  const date = iso instanceof Date ? iso : new Date(iso)
  if (Number.isNaN(date.getTime())) return null

  const now = new Date()
  const months =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth())

  if (months < 1) return 'this month'
  if (months === 1) return '1 month ago'
  return `${months} months ago`
}
