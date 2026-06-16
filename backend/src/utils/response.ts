import type { Response } from 'express'

type SuccessPayload<T> = {
  success: true
  data: T
}

type ErrorPayload = {
  success: false
  error: {
    message: string
    code: string
  }
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  const body: SuccessPayload<T> = { success: true, data }
  return res.status(statusCode).json(body)
}

export function sendError(
  res: Response,
  message: string,
  code: string,
  statusCode = 500,
) {
  const body: ErrorPayload = {
    success: false,
    error: { message, code },
  }
  return res.status(statusCode).json(body)
}
