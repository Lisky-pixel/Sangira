import type {
  AcceptRequestResult,
  CreateRequestResult,
  ListDonorListingRequestsResult,
} from '../types/request'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export type CreateRequestInput = {
  listingId: string
}

export const requestService = {
  async createRequest(input: CreateRequestInput): Promise<CreateRequestResult> {
    const response = await apiClient.post<ApiEnvelope<CreateRequestResult>>(
      '/requests',
      input,
    )
    return unwrapApiResponse(response)
  },

  async listListingRequests(
    listingId: string,
  ): Promise<ListDonorListingRequestsResult> {
    const response = await apiClient.get<
      ApiEnvelope<ListDonorListingRequestsResult>
    >(`/listings/${listingId}/requests`)
    return unwrapApiResponse(response)
  },

  async acceptRequest(requestId: string): Promise<AcceptRequestResult> {
    const response = await apiClient.post<ApiEnvelope<AcceptRequestResult>>(
      `/requests/${requestId}/accept`,
    )
    return unwrapApiResponse(response)
  },
}
