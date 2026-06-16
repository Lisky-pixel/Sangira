import type { ApiErrorPayload, ApiEnvelope } from '../types/api'

export class ApiError extends Error {
  readonly code: string
  readonly fields?: Record<string, string>
  readonly status?: number

  constructor(
    message: string,
    code: string,
    options?: { fields?: Record<string, string>; status?: number },
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.fields = options?.fields
    this.status = options?.status
  }

  static fromEnvelope<T>(
    body: ApiEnvelope<T>,
    status?: number,
  ): ApiError {
    if (body.success) {
      throw new Error('Cannot create ApiError from a successful envelope')
    }

    return new ApiError(body.error.message, body.error.code, {
      fields: body.error.fields,
      status,
    })
  }

  static fromPayload(payload: ApiErrorPayload, status?: number): ApiError {
    return new ApiError(payload.message, payload.code, {
      fields: payload.fields,
      status,
    })
  }
}
