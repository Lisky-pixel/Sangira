import type { Request, Response, NextFunction } from 'express'
import { getPublicPlatformStats } from '../services/public-stats-service.js'
import { sendSuccess } from '../utils/response.js'

export async function getPublicStatsHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const stats = await getPublicPlatformStats()
    return sendSuccess(res, { stats })
  } catch (error) {
    return next(error)
  }
}
