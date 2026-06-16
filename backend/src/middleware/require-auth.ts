import type { NextFunction, Request, Response } from 'express'
import { COOKIE_NAMES } from '../constants/auth.js'
import { verifyAccessToken } from '../utils/tokens.js'
import { unauthorized } from '../utils/app-error.js'

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN] as string | undefined

  if (!token) {
    return next(unauthorized('Authentication required', 'UNAUTHORIZED'))
  }

  try {
    const payload = verifyAccessToken(token)
    req.auth = {
      userId: payload.sub,
      role: payload.role,
    }
    return next()
  } catch {
    return next(unauthorized('Authentication required', 'UNAUTHORIZED'))
  }
}
