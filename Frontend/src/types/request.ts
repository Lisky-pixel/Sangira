import type { RequestStatus } from '../constants/request-status'

/** Mirrors backend Request document shape for portal UI */
export type Request = {
  _id: string
  listing: string
  ngo: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

/** Donor dashboard view — Request enriched with display fields */
export type DonorPendingRequest = Request & {
  ngoName: string
  listingTitle: string
  requestedAt: string
}
