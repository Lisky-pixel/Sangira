import type { Request, Response, NextFunction } from 'express'
import { getTransferReceipt } from '../services/transfer-receipt-service.js'
import type { RequestIdParam } from '../validators/request.js'
import { sendSuccess } from '../utils/response.js'

export async function getReceipt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as RequestIdParam
    const receipt = await getTransferReceipt({
      userId: req.auth!.userId,
      role: req.auth!.role,
      requestId: params.id,
    })

    return sendSuccess(res, { receipt })
  } catch (error) {
    return next(error)
  }
}
