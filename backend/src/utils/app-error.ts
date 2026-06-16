export class AppError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly isOperational: boolean

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    isOperational = true,
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function notFound(message = 'Resource not found', code = 'NOT_FOUND') {
  return new AppError(message, 404, code)
}

export function badRequest(message = 'Bad request', code = 'BAD_REQUEST') {
  return new AppError(message, 400, code)
}

export function unauthorized(
  message = 'Unauthorized',
  code = 'UNAUTHORIZED',
) {
  return new AppError(message, 401, code)
}

export function forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
  return new AppError(message, 403, code)
}
