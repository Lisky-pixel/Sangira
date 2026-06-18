import type { RequestStatus } from '../constants/request-status'
import type { Listing } from './listing'

export type DonorListingRequestNgo = {
  organisationName: string
  verified: true
  dailyCapacity: number
  avatarUrl?: string
}

export type DonorListingRequest = {
  _id: string
  listingId: string
  status: RequestStatus
  createdAt: string
  ngo: DonorListingRequestNgo
}

export type ListDonorListingRequestsResult = {
  requestCount: number
  requests: DonorListingRequest[]
}

export type AcceptRequestResult = {
  request: FoodRequest & { pickupPin: string }
  listing: Listing
}

export type RequestConfirmation = {
  donorConfirmed: boolean
  ngoConfirmed: boolean
  donorConfirmedAt?: string
  ngoConfirmedAt?: string
  completedAt?: string
}

export type FoodRequest = {
  _id: string
  listing: string
  ngo: string
  status: RequestStatus
  confirmation: RequestConfirmation
  createdAt: string
  updatedAt: string
}

export type CreateRequestResult = {
  request: FoodRequest
}

/** PLACEHOLDER donor dashboard shape — replace when live request reads ship */
export type DonorPendingRequest = {
  _id: string
  listing: string
  ngo: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
  ngoName: string
  listingTitle: string
  requestedAt: string
}
