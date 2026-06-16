import type { ApiEnvelope, ApiSuccess } from '../types/api'

export function unwrapApiData<T>(body: ApiEnvelope<T>): T {
  if (!body.success) {
    throw new Error('Expected a successful API response')
  }

  return body.data
}

export function unwrapApiResponse<T>(response: { data: ApiEnvelope<T> }): T {
  return unwrapApiData(response.data as ApiSuccess<T>)
}
