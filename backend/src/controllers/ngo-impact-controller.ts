import type { Request, Response, NextFunction } from 'express'
import { aggregateNgoImpact } from '../services/ngo-impact-service.js'
import { sendSuccess } from '../utils/response.js'

export async function getNgoImpact(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const impact = await aggregateNgoImpact(req.auth!.userId)
    return sendSuccess(res, { impact })
  } catch (error) {
    return next(error)
  }
}
