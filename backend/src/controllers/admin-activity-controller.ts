import type { NextFunction, Request, Response } from 'express'
import { listAdminActivityPaginated } from '../services/admin-platform-activity-service.js'
import type { AdminActivityQuery } from '../validators/admin-activity.js'
import { sendSuccess } from '../utils/response.js'

export async function listAdminActivityHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = req.validatedQuery as AdminActivityQuery
    const result = await listAdminActivityPaginated({
      page: query.page,
      pageSize: query.pageSize,
    })
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}
