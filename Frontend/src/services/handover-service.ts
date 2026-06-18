import type {
  ConfirmHandoverResult,
  GetHandoverResult,
} from '../types/handover'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const handoverService = {
  async getHandover(requestId: string): Promise<GetHandoverResult> {
    const response = await apiClient.get<ApiEnvelope<GetHandoverResult>>(
      `/requests/${requestId}/handover`,
    )
    return unwrapApiResponse(response)
  },

  async confirmHandover(requestId: string): Promise<ConfirmHandoverResult> {
    const response = await apiClient.post<ApiEnvelope<ConfirmHandoverResult>>(
      `/requests/${requestId}/confirm-handover`,
    )
    return unwrapApiResponse(response)
  },
}
