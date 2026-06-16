import type { NextFunction, Request, Response } from 'express'

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value

  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }

  if (typeof value === 'object') {
    const sanitized: Record<string, unknown> = {}

    for (const [key, nested] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.')) continue
      sanitized[key] = sanitizeValue(nested)
    }

    return sanitized
  }

  return value
}

/** Strips MongoDB operator keys ($, .) from req.body — Express 5 compatible */
export function mongoSanitizeMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body)
  }

  next()
}
