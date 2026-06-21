/** Mirrors backend REQUEST_STATUS — donor accept slice uses accepted/declined */
export const REQUEST_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  EXPIRED: 'expired',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS]
