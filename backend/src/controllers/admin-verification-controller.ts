import type { NextFunction, Request, Response } from 'express'
import { countPendingVerifications } from '../services/admin-verification-service.js'
import { sendSuccess } from '../utils/response.js'

export async function getPendingVerificationCount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    void req
    const count = await countPendingVerifications()
    return sendSuccess(res, { count })
  } catch (error) {
    return next(error)
  }
}
