import type { CreateListingPayload } from '../types/create-listing'
import type { Listing } from '../types/listing'
import type { ListingStatus } from '../constants/listing-status'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export type CreateListingResult = {
  listing: Listing
}

type ListMineListingsResponse = {
  listings: Listing[]
}

function buildListingFormData(payload: CreateListingPayload) {
  const formData = new FormData()
  formData.append('foodType', payload.foodType)
  formData.append('quantity', String(payload.quantity))
  formData.append('quantityUnit', payload.quantityUnit)
  formData.append('expiresAt', payload.expiresAt)
  formData.append('storageCondition', payload.storageCondition)
  formData.append('foodLabels', JSON.stringify(payload.foodLabels))
  formData.append('pickupAddress', payload.pickupAddress)

  if (payload.pickupInstructions) {
    formData.append('pickupInstructions', payload.pickupInstructions)
  }

  const photo = payload.photos[0]
  if (photo) {
    formData.append('photo', photo)
  }

  return formData
}

export const listingService = {
  async createListing(payload: CreateListingPayload): Promise<CreateListingResult> {
    const formData = buildListingFormData(payload)
    const response = await apiClient.post<ApiEnvelope<CreateListingResult>>(
      '/listings',
      formData,
    )
    return unwrapApiResponse(response)
  },

  async getMyListings(options?: {
    status?: ListingStatus
  }): Promise<Listing[]> {
    const response = await apiClient.get<ApiEnvelope<ListMineListingsResponse>>(
      '/listings/mine',
      {
        params: options?.status ? { status: options.status } : undefined,
      },
    )
    return unwrapApiResponse(response).listings
  },
}
