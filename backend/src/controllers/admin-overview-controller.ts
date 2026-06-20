import type { NextFunction, Request, Response } from 'express'
import { getAdminOverview } from '../services/admin-overview-service.js'
import { sendSuccess } from '../utils/response.js'

export async function getOverviewHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    void req
    const overview = await getAdminOverview()
    return sendSuccess(res, overview)
  } catch (error) {
    return next(error)
  }
}
