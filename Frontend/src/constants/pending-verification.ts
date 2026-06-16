import { ROUTES } from '../routes/paths'

/** Interval for polling /auth/me while on a verification status screen */
export const VERIFICATION_POLL_INTERVAL_MS = 45_000

export const DOCUMENT_FALLBACK_LABELS = {
  donor: 'Business certificate',
  ngo: 'Registration certificate',
} as const

/** Filenames treated as non-descriptive for display purposes */
export const GENERIC_UPLOAD_FILENAMES = new Set([
  'blob',
  'document',
  'file',
  'image',
  'upload',
  'download',
])

export const SUPPORT = {
  // TODO: replace with real support route or mailto target
  href: ROUTES.CONTACT,
} as const
