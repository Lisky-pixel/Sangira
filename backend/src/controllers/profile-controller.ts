import type { Request, Response, NextFunction } from 'express'
import {
  updateAvatarForUser,
  updateProfileForDonor,
} from '../services/profile-service.js'
import type { PatchProfileInput } from '../validators/profile.js'
import { sendSuccess } from '../utils/response.js'

export async function patchProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await updateProfileForDonor({
      userId: req.auth!.userId,
      patch: req.body as PatchProfileInput,
    })

    return sendSuccess(res, { user })
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
