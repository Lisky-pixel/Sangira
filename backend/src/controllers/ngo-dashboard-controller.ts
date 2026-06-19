import type { NextFunction, Request, Response } from 'express'
import { getNgoDashboard as loadNgoDashboard } from '../services/ngo-dashboard-service.js'
import { sendSuccess } from '../utils/response.js'

export async function getNgoDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dashboard = await loadNgoDashboard(req.auth!.userId)
    return sendSuccess(res, { dashboard })
  } catch (error) {
    return next(error)
  }
}
