import type { NextFunction, Request, Response } from 'express'
import { listAdminListings } from '../services/admin-listings-service.js'
import type { AdminListingsQuery } from '../validators/admin-listings.js'
import { sendSuccess } from '../utils/response.js'

export async function listListingsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = (req.validatedQuery ?? req.query) as AdminListingsQuery
    const result = await listAdminListings(query)
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}
