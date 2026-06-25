import type { Request, Response, NextFunction } from 'express'
import {
  updateAvatarForUser,
  updateProfileForUser,
} from '../services/profile-service.js'
import type { PatchProfileInput } from '../validators/profile.js'
import { sendSuccess } from '../utils/response.js'

export async function patchProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await updateProfileForUser({
      userId: req.auth!.userId,
      role: req.auth!.role,
      patch: req.body as PatchProfileInput,
    })

    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function patchAvatar(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const photo = req.file
    if (!photo) {
      return next()
    }

    const user = await updateAvatarForUser({
      userId: req.auth!.userId,
      photo,
    })

    return sendSuccess(res, { user })
  } catch (error) {
    return next(error)
  }
}
