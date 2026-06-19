import type { NextFunction, Request, Response } from 'express'
import {
  approveVerification,
  countPendingVerifications,
  getVerificationDetail,
  getVerificationDocumentView,
  listVerifications as fetchVerifications,
  rejectVerification,
} from '../services/admin-verification-service.js'
import type {
  AdminVerificationsQuery,
  AdminVerificationIdParam,
} from '../validators/admin-verification.js'
import { sendSuccess } from '../utils/response.js'

async function resolveAdminName(req: Request): Promise<string | undefined> {
  const admin = req.auth
  if (!admin) return undefined

  const { Admin } = await import('../models/user.js')
  const doc = await Admin.findById(admin.userId).select('name').lean()
  return typeof (doc as { name?: string } | null)?.name === 'string'
    ? (doc as { name: string }).name.trim()
    : undefined
}

export async function getPendingVerificationCount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    void req
    const count = await countPendingVerifications()
    return sendSuccess(res, { count })
  } catch (error) {
    return next(error)
  }
}

export async function listVerifications(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await fetchVerifications(
      (req.validatedQuery ?? req.query) as AdminVerificationsQuery,
    )
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

function resolveApplicantId(req: Request): string {
  const params = req.validatedParams as AdminVerificationIdParam | undefined
  return params?.id ?? String(req.params.id)
}

export async function getVerification(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const application = await getVerificationDetail(resolveApplicantId(req))
    return sendSuccess(res, { application })
  } catch (error) {
    return next(error)
  }
}

export async function viewVerificationDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const view = await getVerificationDocumentView(resolveApplicantId(req))
    return sendSuccess(res, view)
  } catch (error) {
    return next(error)
  }
}

export async function approveVerificationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const application = await approveVerification({
      applicantId: resolveApplicantId(req),
      adminId: req.auth!.userId,
      adminName: await resolveAdminName(req),
    })
    return sendSuccess(res, { application })
  } catch (error) {
    return next(error)
  }
}

export async function rejectVerificationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const application = await rejectVerification({
      applicantId: resolveApplicantId(req),
      adminId: req.auth!.userId,
      adminName: await resolveAdminName(req),
      payload: req.body,
    })
    return sendSuccess(res, { application })
  } catch (error) {
    return next(error)
  }
}
