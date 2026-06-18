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
export const HANDOVER_PIN_STORAGE = 'plaintext_donor_scoped_plus_bcrypt_hash' as const
