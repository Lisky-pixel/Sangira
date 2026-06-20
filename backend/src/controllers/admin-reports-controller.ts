import type { NextFunction, Request, Response } from 'express'
import {
  getAdminReports,
  listAdminReportsDonors,
  listAdminReportsNgos,
} from '../services/admin-reports-service.js'
import type { AdminReportsRankingsQuery } from '../validators/admin-reports-rankings.js'
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

export async function listReportsDonorsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = req.validatedQuery as AdminReportsRankingsQuery
    const result = await listAdminReportsDonors(query.page, query.pageSize)
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function listReportsNgosHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = req.validatedQuery as AdminReportsRankingsQuery
    const result = await listAdminReportsNgos(query.page, query.pageSize)
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}
