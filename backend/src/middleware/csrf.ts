import type { NextFunction, Request, Response } from 'express'
import { COOKIE_NAMES, CSRF_HEADER } from '../constants/auth.js'
import { forbidden } from '../utils/app-error.js'
import { parseCsrfCookie } from '../utils/csrf.js'

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * Double-submit CSRF: non-httpOnly cookie + matching X-CSRF-Token header.
 * Safe methods (GET, HEAD, OPTIONS) are exempt.
 */
export function csrfGuard(req: Request, _res: Response, next: NextFunction) {
  if (!MUTATING_METHODS.has(req.method)) {
    return next()
  }

  const headerToken = req.get(CSRF_HEADER)
  const cookieValue = req.cookies?.[COOKIE_NAMES.CSRF] as string | undefined

  if (!headerToken || !cookieValue) {
    return next(forbidden('CSRF token missing', 'CSRF_INVALID'))
  }

  const cookieToken = parseCsrfCookie(cookieValue)

  if (!cookieToken || cookieToken !== headerToken) {
    return next(forbidden('CSRF token invalid', 'CSRF_INVALID'))
  }

  return next()
}
