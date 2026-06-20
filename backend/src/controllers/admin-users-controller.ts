import type { NextFunction, Request, Response } from 'express'
import {
  flagAdminUser,
  getAdminUserDetail,
  getAdminUserDocumentView,
  listAdminUsers,
  reactivateAdminUser,
  restoreAdminUserVerification,
  revokeAdminUserVerification,
  suspendAdminUser,
  unflagAdminUser,
} from '../services/admin-users-service.js'
import type {
  AdminUserIdParam,
  AdminUserOptionalReasonInput,
  AdminUserRequiredReasonInput,
  AdminUsersQuery,
} from '../validators/admin-users.js'
import { sendSuccess } from '../utils/response.js'

async function resolveAdminActor(req: Request) {
  const admin = req.auth
  if (!admin) return { adminId: '', adminName: undefined }

  const { Admin } = await import('../models/user.js')
  const doc = await Admin.findById(admin.userId).select('name').lean()
  const name = (doc as { name?: string } | null)?.name
  return {
    adminId: admin.userId,
    adminName: typeof name === 'string' ? name.trim() : undefined,
  }
}

export async function listUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = (req.validatedQuery ?? req.query) as AdminUsersQuery
    const result = await listAdminUsers(query)
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function getUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.validatedParams as AdminUserIdParam
    const result = await getAdminUserDetail(id)
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function viewUserDocumentHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.validatedParams as AdminUserIdParam
    const view = await getAdminUserDocumentView(id)
    return sendSuccess(res, view)
  } catch (error) {
    return next(error)
  }
}

export async function flagUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.validatedParams as AdminUserIdParam
    const payload = req.body as AdminUserOptionalReasonInput
    const { adminId, adminName } = await resolveAdminActor(req)
    const result = await flagAdminUser({
      userId: id,
      adminId,
      adminName,
      payload,
    })
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function unflagUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.validatedParams as AdminUserIdParam
    const { adminId, adminName } = await resolveAdminActor(req)
    const result = await unflagAdminUser({
      userId: id,
      adminId,
      adminName,
    })
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function suspendUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.validatedParams as AdminUserIdParam
    const payload = req.body as AdminUserRequiredReasonInput
    const { adminId, adminName } = await resolveAdminActor(req)
    const result = await suspendAdminUser({
      userId: id,
      adminId,
      adminName,
      payload,
    })
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function reactivateUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.validatedParams as AdminUserIdParam
    const { adminId, adminName } = await resolveAdminActor(req)
    const result = await reactivateAdminUser({
      userId: id,
      adminId,
      adminName,
    })
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function restoreVerificationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.validatedParams as AdminUserIdParam
    const { adminId, adminName } = await resolveAdminActor(req)
    const result = await restoreAdminUserVerification({
      userId: id,
      adminId,
      adminName,
    })
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function revokeVerificationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.validatedParams as AdminUserIdParam
    const payload = req.body as AdminUserRequiredReasonInput
    const { adminId, adminName } = await resolveAdminActor(req)
    const result = await revokeAdminUserVerification({
      userId: id,
      adminId,
      adminName,
      payload,
    })
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}
