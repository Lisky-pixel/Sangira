import {
  NGO_ACTIVE_REQUESTS_LIMIT,
  NGO_AVAILABLE_NOW_LIMIT,
} from '../constants/ngo-dashboard.js'
import { REQUEST_STATUS } from '../constants/enums.js'
import { Ngo } from '../models/user.js'
import { notFound } from '../utils/app-error.js'
import type { SerializedBrowseListing } from '../utils/serialize-browse-listing.js'
import type { SerializedNgoMyRequest } from '../utils/serialize-ngo-my-request.js'
import { browseActiveListingsForNgo } from './listing-service.js'
import { listMyRequestsForNgo } from './request-service.js'

import { resolveNgoCapacityFromSource } from '../utils/resolve-ngo-capacity.js'
import type { ResolvedNgoCapacity } from '../utils/resolve-ngo-capacity.js'

export type NgoDashboardCapacity = ResolvedNgoCapacity

export type NgoDashboardActiveRequests = {
  requests: SerializedNgoMyRequest[]
  total: number
  requestedListingIds: string[]
}

export type NgoDashboardData = {
  capacity: NgoDashboardCapacity
  availableNow: SerializedBrowseListing[]
  activeRequests: NgoDashboardActiveRequests
}

function filterActiveRequests(
  requests: SerializedNgoMyRequest[],
): SerializedNgoMyRequest[] {
  return requests.filter(
    (request) =>
      request.status === REQUEST_STATUS.REQUESTED ||
      request.status === REQUEST_STATUS.ACCEPTED,
  )
}

export async function getNgoDashboard(
  ngoId: string,
): Promise<NgoDashboardData> {
  const ngo = await Ngo.findById(ngoId)
    .select(
      'dailyCapacity transportAvailable transport pickupHours paused',
    )
    .lean()

  if (!ngo) {
    throw notFound('NGO not found', 'NGO_NOT_FOUND')
  }

  const [availableNow, requestsResult] = await Promise.all([
    browseActiveListingsForNgo({
      limit: NGO_AVAILABLE_NOW_LIMIT,
    }),
    listMyRequestsForNgo(ngoId),
  ])

  const active = filterActiveRequests(requestsResult.requests)

  return {
    capacity: resolveNgoCapacityFromSource(ngo),
    availableNow,
    activeRequests: {
      requests: active.slice(0, NGO_ACTIVE_REQUESTS_LIMIT),
      total: active.length,
      requestedListingIds: active.map((request) => request.listingId),
    },
  }
}
