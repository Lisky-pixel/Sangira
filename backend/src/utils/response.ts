import type { Response } from 'express'
import { ValidationAppError } from './app-error.js'

type SuccessPayload<T> = {
  success: true
  data: T
}

type ErrorPayload = {
  success: false
  error: {
    message: string
    code: string
    fields?: Record<string, string>
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
  fields?: Record<string, string>,
) {
  const body: ErrorPayload = {
    success: false,
    error: { message, code, ...(fields ? { fields } : {}) },
  }
  return res.status(statusCode).json(body)
}

export function sendValidationError(res: Response, error: ValidationAppError) {
  return sendError(
    res,
    error.message,
    error.code,
    error.statusCode,
    error.fields,
  )
}
