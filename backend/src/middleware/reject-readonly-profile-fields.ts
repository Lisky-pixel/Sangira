import type { NextFunction, Request, Response } from 'express'
import {
  FORBIDDEN_PROFILE_PATCH_KEYS,
  PROFILE_READONLY_FIELD_CODE,
} from '../constants/profile.js'
import { badRequest } from '../utils/app-error.js'

export function rejectReadonlyProfileFields(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const body = req.body as Record<string, unknown>
  const forbidden = FORBIDDEN_PROFILE_PATCH_KEYS.filter((key) => key in body)

  if (forbidden.length > 0) {
    return next(
      badRequest(
        `${forbidden.join(', ')} cannot be updated via profile`,
        PROFILE_READONLY_FIELD_CODE,
      ),
    )
  }

  return next()
}
