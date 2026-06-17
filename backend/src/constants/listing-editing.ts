import { LISTING_STATUS } from './enums.js'

/** Stored statuses a donor may edit */
export const LISTING_EDITABLE_STATUSES = [LISTING_STATUS.ACTIVE] as const

/**
 * Stored statuses eligible for soft-cancel.
 * Display "requested" maps to active + pending requests — still cancellable.
 */
export const LISTING_CANCELLABLE_STATUSES = [LISTING_STATUS.ACTIVE] as const

/** Terminal stored statuses excluded from ongoing/dashboard groupings */
export const TERMINAL_LISTING_STATUSES = [
  LISTING_STATUS.COMPLETED,
  LISTING_STATUS.EXPIRED,
  LISTING_STATUS.CANCELLED,
] as const

export const LISTING_EDIT_REJECT_MESSAGE =
  "Listing can't be edited in its current state"

export const LISTING_CANCEL_REJECT_MESSAGE =
  'This listing cannot be cancelled in its current state'
