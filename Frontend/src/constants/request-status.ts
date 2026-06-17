/** Mirrors backend REQUEST_STATUS — swap via shared constants only */
export const REQUEST_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS]
