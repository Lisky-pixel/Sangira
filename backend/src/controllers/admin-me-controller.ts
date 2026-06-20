import type { NextFunction, Request, Response } from 'express'
import {
  getAdminMe,
  updateAdminProfile,
} from '../services/admin-profile-service.js'
import type {
  UpdateAdminProfileInput,
} from '../validators/admin-me.js'
import { sendSuccess } from '../utils/response.js'

export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const adminId = req.auth!.userId
    const data = await getAdminMe(adminId)
    return sendSuccess(res, data)
  } catch (error) {
    return next(error)
  }
}

export async function updateProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const adminId = req.auth!.userId
    const body = req.body as UpdateAdminProfileInput
    const profile = await updateAdminProfile(adminId, body)
    return sendSuccess(res, { profile })
  } catch (error) {
    return next(error)
  }
}
