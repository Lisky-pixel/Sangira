export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'sangira_access_token',
  REFRESH_TOKEN: 'sangira_refresh_token',
  CSRF: 'sangira_csrf',
} as const

export const COOKIE_PATHS = {
  ROOT: '/',
  AUTH: '/auth',
} as const

export const CSRF_HEADER = 'x-csrf-token'

export const CLOUDINARY_FOLDER = 'sangira/verification'

/** User-facing signed document view (GET /verification/document/view) */
export const DOCUMENT_VIEW_URL_TTL_SECONDS = 120

/** Admin signed-view TTL — separate route in a later slice */
export const SIGNED_CERTIFICATE_URL_TTL_SECONDS = 300
