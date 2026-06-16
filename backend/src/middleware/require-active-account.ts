import type { NextFunction, Request, Response } from 'express'
import { ACCOUNT_STATUS } from '../constants/enums.js'
import { User } from '../models/user.js'
import { forbidden, unauthorized } from '../utils/app-error.js'

const BLOCKED_STATUSES = new Set<string>([
  ACCOUNT_STATUS.SUSPENDED,
  ACCOUNT_STATUS.REVOKED,
])

export async function requireActiveAccount(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.auth) {
    return next(unauthorized('Authentication required', 'UNAUTHORIZED'))
  }

  const user = await User.findById(req.auth.userId)

  if (!user) {
    return next(unauthorized('Authentication required', 'UNAUTHORIZED'))
  }

  if (BLOCKED_STATUSES.has(user.accountStatus)) {
    return next(
      forbidden('This account has been suspended or revoked', 'ACCOUNT_BLOCKED'),
    )
  }

  return next()
}
