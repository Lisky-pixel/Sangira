import type { CreateRequestResult } from '../types/request'
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
}
