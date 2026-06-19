/** Mirrors backend HANDOVER_SOCKET — shared by donor + NGO handover clients */
export const HANDOVER = {
  PICKUP_PIN_LENGTH: 6,
} as const

export const HANDOVER_SOCKET = {
  EVENT_JOIN: 'handover:join',
  EVENT_UPDATED: 'handover:updated',
} as const

/** Mirrors backend HANDOVER_ERROR_CODES — used for client-side error handling */
export const HANDOVER_ERROR_CODES = {
  INCORRECT_PIN: 'INCORRECT_PIN',
  TOO_MANY_PIN_ATTEMPTS: 'TOO_MANY_PIN_ATTEMPTS',
} as const

export const HANDOVER_ROOM_PREFIX = 'request:' as const
