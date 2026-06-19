import type {
  GetNgoCapacityResult,
  NgoCapacitySettings,
  UpdateNgoCapacityResult,
} from '../types/ngo-capacity'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const ngoCapacityService = {
  async getCapacity(): Promise<NgoCapacitySettings> {
    const response = await apiClient.get<ApiEnvelope<GetNgoCapacityResult>>(
      '/ngo/capacity',
    )
    const data = unwrapApiResponse(response)
    return data.capacity
  },

  async updateCapacity(
    payload: NgoCapacitySettings,
  ): Promise<NgoCapacitySettings> {
    const response = await apiClient.put<ApiEnvelope<UpdateNgoCapacityResult>>(
      '/ngo/capacity',
      payload,
    )
    const data = unwrapApiResponse(response)
    return data.capacity
  },
}
