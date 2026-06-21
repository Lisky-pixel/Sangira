import {
  NGO_REQUESTS_TAB,
  type NgoRequestsTab,
} from '../constants/ngo-requests'
import { REQUEST_STATUS } from '../constants/request-status'
import type { NgoMyRequest } from '../types/ngo-my-request'

export function filterNgoRequestsByTab(
  requests: NgoMyRequest[],
  tab: NgoRequestsTab,
): NgoMyRequest[] {
  switch (tab) {
    case NGO_REQUESTS_TAB.PENDING:
      return requests.filter((r) => r.status === REQUEST_STATUS.REQUESTED)
    case NGO_REQUESTS_TAB.ACCEPTED:
      return requests.filter((r) => r.status === REQUEST_STATUS.ACCEPTED)
    case NGO_REQUESTS_TAB.COMPLETED:
      return requests.filter((r) => r.status === REQUEST_STATUS.COMPLETED)
    case NGO_REQUESTS_TAB.DECLINED:
      return requests.filter((r) => r.status === REQUEST_STATUS.DECLINED)
    case NGO_REQUESTS_TAB.EXPIRED:
      return requests.filter((r) => r.status === REQUEST_STATUS.EXPIRED)
    default:
      return requests
  }
}

export function getActiveRequestedListingIds(
  requests: NgoMyRequest[],
): Set<string> {
  return new Set(
    requests
      .filter(
        (request) =>
          request.status === REQUEST_STATUS.REQUESTED ||
          request.status === REQUEST_STATUS.ACCEPTED,
      )
      .map((request) => request.listingId),
  )
}

export function getEarlierHistoryRequests(
  requests: NgoMyRequest[],
): NgoMyRequest[] {
  return requests
    .filter(
      (request) =>
        request.status === REQUEST_STATUS.COMPLETED ||
        request.status === REQUEST_STATUS.DECLINED ||
        request.status === REQUEST_STATUS.EXPIRED,
    )
    .slice(0, 10)
}
