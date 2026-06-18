import type { RequestStatus } from '../constants/request-status'

export type RequestConfirmation = {
  donorConfirmed: boolean
  ngoConfirmed: boolean
  donorConfirmedAt?: string
  ngoConfirmedAt?: string
  completedAt?: string
}

/** Mirrors backend serialized Request document */
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
