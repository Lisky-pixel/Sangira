import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodType } from 'zod'
import { ValidationAppError } from '../utils/app-error.js'

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return next(toValidationError(result.error))
    }

    req.body = result.data
    return next()
  }
}

function toValidationError(error: ZodError): ValidationAppError {
  const fields: Record<string, string> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'body'
    if (!fields[path]) {
      fields[path] = issue.message
    }
  }

  return new ValidationAppError(fields)
}
