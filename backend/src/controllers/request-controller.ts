import type { Request, Response, NextFunction } from 'express'
import { createRequestForNgo } from '../services/request-service.js'
import type { CreateRequestInput } from '../validators/request.js'
import { sendSuccess } from '../utils/response.js'

export async function createRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = req.body as CreateRequestInput
    const request = await createRequestForNgo({
      ngoId: req.auth!.userId,
      listingId: body.listingId,
    })

    return sendSuccess(res, { request }, 201)
  } catch (error) {
    return next(error)
  }
}
