import type { NextFunction, Request, Response } from 'express'
import { changePasswordForUser } from '../services/password-change-service.js'
import type { ChangePasswordInput } from '../validators/password-change.js'
import { clearAuthCookies } from '../utils/cookies.js'
import { sendSuccess } from '../utils/response.js'

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = req.body as ChangePasswordInput
    await changePasswordForUser(req.auth!.userId, input)
    clearAuthCookies(res)
    return sendSuccess(res, { passwordUpdated: true })
  } catch (error) {
    return next(error)
  }
}
