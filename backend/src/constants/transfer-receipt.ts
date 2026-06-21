export const TRANSFER_RECEIPT_ERROR_CODES = {
  RECEIPT_FORBIDDEN: 'RECEIPT_FORBIDDEN',
  RECEIPT_NOT_AVAILABLE: 'RECEIPT_NOT_AVAILABLE',
  REQUEST_NOT_FOUND: 'REQUEST_NOT_FOUND',
} as const

export const TRANSFER_RECEIPT_MESSAGES = {
  RECEIPT_FORBIDDEN: 'You do not have access to this transfer receipt.',
  RECEIPT_NOT_AVAILABLE: 'No receipt available for this transfer.',
  REQUEST_NOT_FOUND: 'Request not found.',
} as const
