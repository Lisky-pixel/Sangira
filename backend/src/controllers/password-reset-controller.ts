import type { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../utils/response.js'
import {
  requestPasswordResetCode,
  verifyPasswordResetCode,
} from '../services/password-reset-service.js'
import type {
  PasswordRequestCodeInput,
  PasswordVerifyInput,
} from '../validators/password-reset.js'
import { setAuthCookies } from '../utils/cookies.js'
import { serializeUser } from '../utils/user-serializer.js'

export async function requestCode(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = req.body as PasswordRequestCodeInput
    const result = await requestPasswordResetCode(input)
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function verify(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = req.body as PasswordVerifyInput
    const result = await verifyPasswordResetCode(input, req)
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken)
    return sendSuccess(res, {
      user: serializeUser(result.user),
      verificationStatus: result.verificationStatus,
    })
  } catch (error) {
    return next(error)
  }
}

