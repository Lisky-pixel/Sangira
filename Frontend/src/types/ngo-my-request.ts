import type { RequestStatus } from '../constants/request-status'
import type { Listing } from './listing'

export type NgoMyRequestListing = Pick<
  Listing,
  | '_id'
  | 'title'
  | 'quantity'
  | 'quantityUnit'
  | 'photos'
  | 'pickupAddress'
  | 'pickupLocation'
  | 'pickupCoordinates'
  | 'expiresAt'
>

export type NgoMyRequestDonor = {
  organisationName: string
  verified: boolean
}

export type NgoMyRequest = {
  _id: string
  listingId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
  listing: NgoMyRequestListing
  donor: NgoMyRequestDonor
  handoverReady?: boolean
  completedAt?: string
  declinedAt?: string
  declinedReason?: string
}

export type NgoMyRequestsCounts = {
  pending: number
  accepted: number
  completed: number
  declined: number
}

export type ListNgoMyRequestsResult = {
  requests: NgoMyRequest[]
  counts: NgoMyRequestsCounts
}
