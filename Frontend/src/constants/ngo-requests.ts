import { REQUEST_STATUS } from './request-status'

/** NGO My requests tab keys — map to REQUEST_STATUS groupings */
export const NGO_REQUESTS_TAB = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  DECLINED: 'declined',
} as const

export type NgoRequestsTab =
  (typeof NGO_REQUESTS_TAB)[keyof typeof NGO_REQUESTS_TAB]

export const NGO_REQUESTS_TAB_VALUES = [
  NGO_REQUESTS_TAB.PENDING,
  NGO_REQUESTS_TAB.ACCEPTED,
  NGO_REQUESTS_TAB.COMPLETED,
  NGO_REQUESTS_TAB.DECLINED,
] as const

export const NGO_REQUESTS_PAGE_SIZE = 12

export const NGO_REQUESTS_STATUS_BY_TAB: Record<
  NgoRequestsTab,
  readonly (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS][]
> = {
  [NGO_REQUESTS_TAB.PENDING]: [REQUEST_STATUS.REQUESTED],
  [NGO_REQUESTS_TAB.ACCEPTED]: [REQUEST_STATUS.ACCEPTED],
  [NGO_REQUESTS_TAB.COMPLETED]: [REQUEST_STATUS.COMPLETED],
  [NGO_REQUESTS_TAB.DECLINED]: [REQUEST_STATUS.DECLINED],
}
