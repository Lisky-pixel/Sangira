import type { NextFunction, Request, Response } from 'express'
import type { Role } from '../constants/enums.js'
import { forbidden } from '../utils/app-error.js'

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(forbidden('Insufficient permissions', 'FORBIDDEN'))
    }

    if (!roles.includes(req.auth.role)) {
      return next(forbidden('Insufficient permissions', 'FORBIDDEN'))
    }

    return next()
  }
}
