import type { NextFunction, Request, Response } from 'express'
import { getAdminReports } from '../services/admin-reports-service.js'
import { sendSuccess } from '../utils/response.js'

export async function getReportsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    void req
    const reports = await getAdminReports()
    return sendSuccess(res, reports)
  } catch (error) {
    return next(error)
  }
}
