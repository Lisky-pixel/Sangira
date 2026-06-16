export type ApiErrorPayload = {
  message: string
  code: string
  fields?: Record<string, string>
}

export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiFailure = {
  success: false
  error: ApiErrorPayload
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure
