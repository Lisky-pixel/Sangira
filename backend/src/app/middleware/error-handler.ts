import type { NextFunction, Request, Response } from 'express'
import { ValidationAppError, AppError } from '../../utils/app-error.js'
import { sendError, sendValidationError } from '../../utils/response.js'
import { config } from '../../config/env.js'
import multer from 'multer'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ValidationAppError) {
    return sendValidationError(res, err)
  }

  if (err instanceof AppError) {
    if (!err.isOperational) {
      console.error(err)
    }

    return sendError(res, err.message, err.code, err.statusCode)
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File must be under 5 MB'
        : err.message
    const code =
      err.code === 'LIMIT_FILE_SIZE' ? 'DOCUMENT_TOO_LARGE' : 'UPLOAD_ERROR'
    return sendError(res, message, code, 400)
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
