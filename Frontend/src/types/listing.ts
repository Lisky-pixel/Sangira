import type { ListingStatus } from '../constants/listing-status'

/** Mirrors backend Listing document shape for portal UI */
export type Listing = {
  _id: string
  donor: string
  title: string
  description?: string
  servings: number
  storageConditions?: string
  photos: string[]
  expiresAt: string
  status: ListingStatus
  createdAt: string
  updatedAt: string
  requestCount?: number
}
