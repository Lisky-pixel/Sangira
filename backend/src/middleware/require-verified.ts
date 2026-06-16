import type { NextFunction, Request, Response } from 'express'
import { VERIFICATION_STATUS } from '../constants/enums.js'
import { User } from '../models/user.js'
import { forbidden, unauthorized } from '../utils/app-error.js'

/** Portal routes — account must be approved by admin */
export async function requireVerified(
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

  const verification = (user as { verification?: { status?: string } })
    .verification

  if (verification?.status !== VERIFICATION_STATUS.APPROVED) {
    return next(
      forbidden('Account verification required', 'VERIFICATION_REQUIRED'),
    )
  }

  return next()
}
