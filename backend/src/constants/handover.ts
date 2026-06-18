/** Handover credential generation tunables */
export const HANDOVER = {
  PICKUP_PIN_LENGTH: 6,
  QR_TOKEN_BYTES: 48,
} as const

/**
 * PIN storage: plaintext `pickupPin` (select: false) for donor-only display on the
 * handover page, plus `pickupPinHash` (bcrypt) for NGO PIN verification in the
 * pickup slice. Short-lived, owner-scoped — not logged.
 */
export const HANDOVER_PIN_STORAGE =
  'plaintext_donor_scoped_plus_bcrypt_hash' as const

export const HANDOVER_PIN = {
  MAX_ATTEMPTS: 5,
} as const

/**
 * Impact on completion — meals count servings only; kg is tracked separately.
 * Servings are converted to an estimated kg via SERVINGS_TO_KG_ESTIMATE; items → 0.
 */
export const HANDOVER_IMPACT = {
  SERVINGS_TO_KG_ESTIMATE: 0.35,
} as const

export const HANDOVER_SOCKET = {
  EVENT_JOIN: 'handover:join',
  EVENT_UPDATED: 'handover:updated',
} as const

export const HANDOVER_ROOM_PREFIX = 'request:' as const

export const HANDOVER_ERROR_CODES = {
  HANDOVER_FORBIDDEN: 'HANDOVER_FORBIDDEN',
  HANDOVER_NOT_AVAILABLE: 'HANDOVER_NOT_AVAILABLE',
  HANDOVER_ALREADY_COMPLETED: 'HANDOVER_ALREADY_COMPLETED',
  DONOR_ALREADY_CONFIRMED: 'DONOR_ALREADY_CONFIRMED',
  NGO_ALREADY_CONFIRMED: 'NGO_ALREADY_CONFIRMED',
  INCORRECT_PIN: 'INCORRECT_PIN',
  TOO_MANY_PIN_ATTEMPTS: 'TOO_MANY_PIN_ATTEMPTS',
  HANDOVER_COMPLETE_FAILED: 'HANDOVER_COMPLETE_FAILED',
} as const

export const HANDOVER_MESSAGES = {
  HANDOVER_FORBIDDEN: 'You do not have access to this handover.',
  HANDOVER_NOT_AVAILABLE:
    'This handover is not available. The request must be accepted and in progress.',
  HANDOVER_ALREADY_COMPLETED: 'This handover has already been completed.',
  DONOR_ALREADY_CONFIRMED: 'You have already confirmed this handover.',
  NGO_ALREADY_CONFIRMED: 'Receipt has already been confirmed for this handover.',
  INCORRECT_PIN: 'Incorrect PIN.',
  TOO_MANY_PIN_ATTEMPTS:
    'Too many incorrect PIN attempts. Please contact the donor for assistance.',
  HANDOVER_COMPLETE_FAILED:
    'Could not complete this handover. Please try again or contact support.',
} as const
