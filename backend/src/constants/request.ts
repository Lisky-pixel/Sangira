export const REQUEST_ERROR_CODES = {
  LISTING_NOT_AVAILABLE: 'LISTING_NOT_AVAILABLE',
  LISTING_NOT_ACCEPTING: 'LISTING_NOT_ACCEPTING',
  REQUEST_ALREADY_EXISTS: 'REQUEST_ALREADY_EXISTS',
  REQUEST_NOT_FOUND: 'REQUEST_NOT_FOUND',
  REQUEST_ALREADY_HANDLED: 'REQUEST_ALREADY_HANDLED',
  LISTING_NOT_ACCEPTING_REQUESTS: 'LISTING_NOT_ACCEPTING_REQUESTS',
  REQUEST_ACCEPT_FAILED: 'REQUEST_ACCEPT_FAILED',
} as const

export const REQUEST_MESSAGES = {
  LISTING_NOT_AVAILABLE: 'This listing is no longer available.',
  LISTING_NOT_ACCEPTING: 'This listing is no longer accepting requests.',
  ALREADY_REQUESTED: "You've already requested this listing.",
  REQUEST_NOT_FOUND: 'Request not found.',
  REQUEST_ALREADY_HANDLED: 'This request has already been handled.',
  LISTING_NOT_ACCEPTING_REQUESTS:
    'This listing is no longer accepting requests.',
  REQUEST_ACCEPT_FAILED:
    'Could not accept this request. Please try again or contact support.',
} as const
