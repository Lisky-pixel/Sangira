import { LISTING_STATUS } from './enums.js'

/** Stored statuses a donor may edit (no pending/accepted request workflow yet) */
export const LISTING_EDITABLE_STATUSES = [LISTING_STATUS.ACTIVE] as const

/** Stored statuses eligible for soft-cancel */
export const LISTING_CANCELLABLE_STATUSES = [LISTING_STATUS.ACTIVE] as const
