import type { NextFunction, Request, Response } from 'express'
import { User } from '../models/user.js'
import { forbidden, unauthorized } from '../utils/app-error.js'
import { isParticipantActionBlocked } from './require-verified-active.js'

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

  const blocked = isParticipantActionBlocked({
    accountStatus: user.accountStatus,
    verification: (user as { verification?: { status?: string } }).verification,
  })

  if (blocked.blocked) {
    return next(forbidden(blocked.message!, blocked.code!))
  }

  return next()
}
