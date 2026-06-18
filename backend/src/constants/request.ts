export const REQUEST_ERROR_CODES = {
  LISTING_NOT_AVAILABLE: 'LISTING_NOT_AVAILABLE',
  LISTING_NOT_ACCEPTING: 'LISTING_NOT_ACCEPTING',
  REQUEST_ALREADY_EXISTS: 'REQUEST_ALREADY_EXISTS',
} as const

export const REQUEST_MESSAGES = {
  LISTING_NOT_AVAILABLE: 'This listing is no longer available.',
  LISTING_NOT_ACCEPTING: 'This listing is no longer accepting requests.',
  ALREADY_REQUESTED: "You've already requested this listing.",
} as const
