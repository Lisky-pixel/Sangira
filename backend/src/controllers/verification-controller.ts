import type { Request, Response, NextFunction } from 'express'
import { resubmitVerificationDocument } from '../services/verification-service.js'
import { sendSuccess } from '../utils/response.js'

export async function resubmit(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await resubmitVerificationDocument(req.auth!.userId, req.file!)

    return sendSuccess(res, {
      verificationStatus: result.verificationStatus,
    })
  } catch (error) {
    return next(error)
  }
}
