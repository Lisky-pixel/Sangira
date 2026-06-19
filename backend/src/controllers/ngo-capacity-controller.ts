import type { NextFunction, Request, Response } from 'express'
import {
  getNgoCapacity as loadNgoCapacity,
  updateNgoCapacity,
} from '../services/ngo-capacity-service.js'
import { sendSuccess } from '../utils/response.js'

export async function getNgoCapacity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const capacity = await loadNgoCapacity(req.auth!.userId)
    return sendSuccess(res, { capacity })
  } catch (error) {
    return next(error)
  }
}

export async function putNgoCapacity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const capacity = await updateNgoCapacity(req.auth!.userId, req.body)
    return sendSuccess(res, { capacity })
  } catch (error) {
    return next(error)
  }
}
