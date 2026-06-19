import type { Request, Response, NextFunction } from 'express'
import {
  confirmHandoverForDonor,
  confirmReceiptForNgo,
  getHandoverView,
} from '../services/handover-service.js'
import type { ConfirmReceiptInput } from '../validators/handover.js'
import type { RequestIdParam } from '../validators/request.js'
import { sendSuccess } from '../utils/response.js'

export async function getHandover(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as RequestIdParam
    const handover = await getHandoverView({
      userId: req.auth!.userId,
      requestId: params.id,
    })

    return sendSuccess(res, { handover })
  } catch (error) {
    return next(error)
  }
}

export async function confirmHandover(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as RequestIdParam
    const handover = await confirmHandoverForDonor({
      donorId: req.auth!.userId,
      requestId: params.id,
    })

    return sendSuccess(res, { handover })
  } catch (error) {
    return next(error)
  }
}

export async function confirmReceipt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as RequestIdParam
    const body = req.body as ConfirmReceiptInput
    const result = await confirmReceiptForNgo({
      ngoId: req.auth!.userId,
      requestId: params.id,
      pin: body.pin,
      condition: body.condition,
      note: body.note,
    })

    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}
