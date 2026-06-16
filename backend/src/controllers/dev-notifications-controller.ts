import type { Request, Response, NextFunction } from 'express'
import { sendSuccess } from '../utils/response.js'
import { sendTestEmail } from '../services/dev-notifications-service.js'
import type { DevNotificationsTestInput } from '../validators/dev-notifications.js'

export async function test(
  req: Request<unknown, unknown, DevNotificationsTestInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await sendTestEmail(req.body)
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

