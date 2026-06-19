export const ADMIN_VERIFICATION_PAGE = {
  PAGE_SIZE: 10,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const

export const ADMIN_ROOM = 'admins' as const

export const VERIFICATION_SOCKET = {
  EVENT_NEW: 'verification:new',
  EVENT_UPDATED: 'verification:updated',
} as const

/** Hours waiting before the queue highlights urgency (red) */
export const VERIFICATION_WAITING_URGENT_HOURS = 24
