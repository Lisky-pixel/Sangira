import type { Request, Response, NextFunction } from 'express'
import {
  aggregateDonorImpact,
  getDonorDashboard as loadDonorDashboard,
  listDonorActivityPaginated,
} from '../services/donor-impact-service.js'
import type { DonorActivityQuery } from '../validators/donor-activity.js'
import { sendSuccess } from '../utils/response.js'

export async function getDonorImpact(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const impact = await aggregateDonorImpact(req.auth!.userId)
    return sendSuccess(res, { impact })
  } catch (error) {
    return next(error)
  }
}

export async function getDonorDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dashboard = await loadDonorDashboard(req.auth!.userId)
    return sendSuccess(res, { dashboard })
  } catch (error) {
    return next(error)
  }
}

export async function getDonorActivity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = req.validatedQuery as DonorActivityQuery
    const result = await listDonorActivityPaginated(req.auth!.userId, {
      page: query.page,
      pageSize: query.pageSize,
    })
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}
