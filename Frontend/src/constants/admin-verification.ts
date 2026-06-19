/** Mirrors backend ADMIN_VERIFICATION_PAGE */
export const ADMIN_VERIFICATION_PAGE = {
  PAGE_SIZE: 10,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const

/** Mirrors backend VERIFICATION_SOCKET */
export const VERIFICATION_SOCKET = {
  EVENT_NEW: 'verification:new',
  EVENT_UPDATED: 'verification:updated',
} as const

/** Subtle row highlight duration after a live queue change */
export const VERIFICATION_ROW_HIGHLIGHT_MS = 2000

/** Mirrors backend VERIFICATION_WAITING_URGENT_HOURS */
export const VERIFICATION_WAITING_URGENT_HOURS = 24

/** Mirrors backend VERIFICATION_ALREADY_HANDLED conflict code */
export const VERIFICATION_ERROR_CODES = {
  ALREADY_HANDLED: 'VERIFICATION_ALREADY_HANDLED',
} as const
