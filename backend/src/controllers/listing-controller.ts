import type { Request, Response, NextFunction } from 'express'
import {
  cancelListingForDonor,
  browseActiveListingsForNgo,
  createListingForDonor,
  getBrowseListingForNgo,
  getListingForDonor,
  listDonorListings,
  updateListingForDonor,
} from '../services/listing-service.js'
import { listRequestsForDonorListing } from '../services/request-service.js'
import type {
  CreateListingInput,
  ListMineListingsQuery,
  ListingIdParam,
  UpdateListingInput,
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

export async function browse(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const listings = await browseActiveListingsForNgo()
    return sendSuccess(res, { listings })
  } catch (error) {
    return next(error)
  }
}

export async function browseById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as ListingIdParam
    const listing = await getBrowseListingForNgo({
      listingId: params.id,
      ngoId: req.auth!.userId,
    })
    return sendSuccess(res, { listing })
  } catch (error) {
    return next(error)
  }
}

export async function listListingRequests(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as ListingIdParam
    const result = await listRequestsForDonorListing({
      donorId: req.auth!.userId,
      listingId: params.id,
    })

    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as ListingIdParam
    const listing = await getListingForDonor({
      donorId: req.auth!.userId,
      listingId: params.id,
    })

    return sendSuccess(res, { listing })
  } catch (error) {
    return next(error)
  }
}

export async function updateListing(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as ListingIdParam
    const listing = await updateListingForDonor({
      donorId: req.auth!.userId,
      listingId: params.id,
      data: req.body as UpdateListingInput,
      photo: req.file,
    })

    return sendSuccess(res, { listing })
  } catch (error) {
    return next(error)
  }
}

export async function cancelListing(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as ListingIdParam
    const listing = await cancelListingForDonor({
      donorId: req.auth!.userId,
      listingId: params.id,
    })

    return sendSuccess(res, { listing })
  } catch (error) {
    return next(error)
  }
}
