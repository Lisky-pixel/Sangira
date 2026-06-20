import type { NextFunction, Request, Response } from 'express'
import {
  ACCOUNT_STATUS,
  VERIFICATION_STATUS,
} from '../constants/enums.js'
import { ADMIN_USER_ENFORCEMENT } from '../constants/admin-users.js'
import { User } from '../models/user.js'
import { forbidden, unauthorized } from '../utils/app-error.js'

type OrgUserWithStatus = {
  accountStatus: string
  verification?: { status?: string }
}

export function isParticipantActionBlocked(user: OrgUserWithStatus): {
  blocked: boolean
  message?: string
  code?: string
} {
  if (user.accountStatus === ACCOUNT_STATUS.SUSPENDED) {
    return {
      blocked: true,
      message: ADMIN_USER_ENFORCEMENT.SUSPENDED_MESSAGE,
      code: ADMIN_USER_ENFORCEMENT.SUSPENDED_CODE,
    }
  }

  if (user.verification?.status === VERIFICATION_STATUS.REVOKED) {
    return {
      blocked: true,
      message: ADMIN_USER_ENFORCEMENT.REVOKED_MESSAGE,
      code: ADMIN_USER_ENFORCEMENT.REVOKED_CODE,
    }
  }

  return { blocked: false }
}

/** Blocks suspended/revoked orgs from participant mutations; still requires approved verification. */
export async function requireVerifiedActive(
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

  const verification = (user as { verification?: { status?: string } })
    .verification

  if (verification?.status !== VERIFICATION_STATUS.APPROVED) {
    return next(
      forbidden('Account verification required', 'VERIFICATION_REQUIRED'),
    )
  }

  return next()
}
