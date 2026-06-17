import type { Request, Response, NextFunction } from 'express'
import {
  createListingForDonor,
  listDonorListings,
} from '../services/listing-service.js'
import type {
  CreateListingInput,
  ListMineListingsQuery,
} from '../validators/listing.js'
import { sendSuccess } from '../utils/response.js'

export async function createListing(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const photo = req.file
    if (!photo) {
      return next()
    }

    const listing = await createListingForDonor({
      donorId: req.auth!.userId,
      data: req.body as CreateListingInput,
      photo,
    })

    return sendSuccess(res, { listing }, 201)
  } catch (error) {
    return next(error)
  }
}

export async function listMine(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = req.validatedQuery as ListMineListingsQuery
    const listings = await listDonorListings({
      donorId: req.auth!.userId,
      status: query.status,
    })

    return sendSuccess(res, { listings })
  } catch (error) {
    return next(error)
  }
}
