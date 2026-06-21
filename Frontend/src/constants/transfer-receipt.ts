/** Query param values for transfer receipt back navigation */
export const TRANSFER_RECEIPT_FROM = {
  NGO_REQUESTS: 'ngo-requests',
  DONOR_LISTINGS: 'donor-listings',
  DONOR_ACTIVITY: 'donor-activity',
  ADMIN: 'admin',
} as const

export type TransferReceiptFrom =
  (typeof TRANSFER_RECEIPT_FROM)[keyof typeof TRANSFER_RECEIPT_FROM]

export const TRANSFER_RECEIPT_FROM_VALUES = Object.values(
  TRANSFER_RECEIPT_FROM,
) as [TransferReceiptFrom, ...TransferReceiptFrom[]]

export const TRANSFER_RECEIPT_ROUTE_PATTERN = '/transfers/:id/receipt' as const
