import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../utils/app-error.js'
import { sendError } from '../../utils/response.js'
import { config } from '../../config/env.js'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      console.error(err)
    }

    return sendError(res, err.message, err.code, err.statusCode)
  }

  console.error(err)

  const message =
    config.NODE_ENV === 'production'
      ? 'Internal server error'
      : err instanceof Error
        ? err.message
        : 'Internal server error'

  return sendError(res, message, 'INTERNAL_ERROR', 500)
}
