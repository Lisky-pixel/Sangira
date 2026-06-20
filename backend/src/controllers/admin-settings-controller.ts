import type { NextFunction, Request, Response } from 'express'
import { getAdminSettings } from '../services/admin-settings-service.js'
import { updateVerificationSlaTargetHours } from '../services/platform-settings-service.js'
import type { UpdatePlatformSettingsInput } from '../validators/admin-me.js'
import { sendSuccess } from '../utils/response.js'

export async function getSettingsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const adminId = req.auth!.userId
    const settings = await getAdminSettings(adminId)
    return sendSuccess(res, settings)
  } catch (error) {
    return next(error)
  }
}

export async function updatePlatformSettingsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    void req
    const body = req.body as UpdatePlatformSettingsInput
    const verificationSlaTargetHours = await updateVerificationSlaTargetHours(
      body.verificationSlaTargetHours,
    )
    return sendSuccess(res, { verificationSlaTargetHours })
  } catch (error) {
    return next(error)
  }
}
