import { apiClient } from './api-client'

// TODO: replace with real endpoints when the backend is wired up.
// Pattern: one service module per domain; components import services, never apiClient.

type HealthResponse = {
  success: boolean
  data: { status: string }
}

export const exampleService = {
  async getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health')
    return response.data
  },
}
