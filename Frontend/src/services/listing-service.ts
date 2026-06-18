import type { CreateListingPayload } from '../types/create-listing'
import type { Listing } from '../types/listing'
import type { ListingStatus } from '../constants/listing-status'
import type { UpdateListingPayload } from '../types/update-listing'
import type { NgoBrowseListing } from '../types/ngo-browse-listing'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export type CreateListingResult = {
  listing: Listing
}

export type GetListingResult = {
  listing: Listing
}

type ListMineListingsResponse = {
  listings: Listing[]
}

type BrowseListingsResponse = {
  listings: NgoBrowseListing[]
}

type GetBrowseListingResponse = {
  listing: NgoBrowseListing
}

function appendListingFields(
  formData: FormData,
  payload: Omit<CreateListingPayload, 'photos'> & { photo?: File },
) {
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

  if (payload.photo) {
    formData.append('photo', payload.photo)
  }
}

function buildCreateListingFormData(payload: CreateListingPayload) {
  const formData = new FormData()
  const photo = payload.photos[0]

  appendListingFields(formData, {
    ...payload,
    photo,
  })

  return formData
}

function buildUpdateListingFormData(payload: UpdateListingPayload) {
  const formData = new FormData()
  appendListingFields(formData, payload)
  return formData
}

export const listingService = {
  async createListing(payload: CreateListingPayload): Promise<CreateListingResult> {
    const formData = buildCreateListingFormData(payload)
    const response = await apiClient.post<ApiEnvelope<CreateListingResult>>(
      '/listings',
      formData,
    )
    return unwrapApiResponse(response)
  },

  async getListing(id: string): Promise<Listing> {
    const response = await apiClient.get<ApiEnvelope<GetListingResult>>(
      `/listings/${id}`,
    )
    return unwrapApiResponse(response).listing
  },

  async updateListing(
    id: string,
    payload: UpdateListingPayload,
  ): Promise<GetListingResult> {
    const formData = buildUpdateListingFormData(payload)
    const response = await apiClient.patch<ApiEnvelope<GetListingResult>>(
      `/listings/${id}`,
      formData,
    )
    return unwrapApiResponse(response)
  },

  async cancelListing(id: string): Promise<GetListingResult> {
    const response = await apiClient.post<ApiEnvelope<GetListingResult>>(
      `/listings/${id}/cancel`,
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

  async browseListings(): Promise<NgoBrowseListing[]> {
    const response = await apiClient.get<ApiEnvelope<BrowseListingsResponse>>(
      '/listings/browse',
    )
    return unwrapApiResponse(response).listings
  },

  async getBrowseListing(id: string): Promise<NgoBrowseListing> {
    const response = await apiClient.get<ApiEnvelope<GetBrowseListingResponse>>(
      `/listings/browse/${id}`,
    )
    return unwrapApiResponse(response).listing
  },
}
