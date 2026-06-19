/** Mirrors backend NOTIFICATION_TYPE — donor in-app notifications */
export const DONOR_NOTIFICATION_TYPE = {
  REQUEST_RECEIVED: 'request_received',
  REQUEST_ACCEPTED: 'request_accepted',
  TRANSFER_COMPLETE: 'transfer_complete',
} as const

export type DonorNotificationType =
  (typeof DONOR_NOTIFICATION_TYPE)[keyof typeof DONOR_NOTIFICATION_TYPE]

export const NOTIFICATION_DROPDOWN_LIMIT = 10

export const NOTIFICATION_SOCKET = {
  EVENT_NEW: 'notification:new',
} as const
