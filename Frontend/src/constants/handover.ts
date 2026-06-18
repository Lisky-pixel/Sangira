/** Mirrors backend HANDOVER_SOCKET — shared by donor + NGO handover clients */
export const HANDOVER = {
  PICKUP_PIN_LENGTH: 6,
} as const

export const HANDOVER_SOCKET = {
  EVENT_JOIN: 'handover:join',
  EVENT_UPDATED: 'handover:updated',
} as const

export const HANDOVER_ROOM_PREFIX = 'request:' as const
