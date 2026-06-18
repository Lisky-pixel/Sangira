import type { Request, Response, NextFunction } from 'express'
import { getListingForDonor } from '../services/listing-service.js'
import {
  acceptRequestForDonor,
  createRequestForNgo,
} from '../services/request-service.js'
import type { CreateRequestInput } from '../validators/request.js'
import type { RequestIdParam } from '../validators/request.js'
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

export async function acceptRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as RequestIdParam
    const request = await acceptRequestForDonor({
      donorId: req.auth!.userId,
      requestId: params.id,
    })

    const listing = await getListingForDonor({
      donorId: req.auth!.userId,
      listingId: request.listing,
    })

    return sendSuccess(res, { request, listing })
  } catch (error) {
    return next(error)
  }
}
