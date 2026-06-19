import { Router } from 'express'
import * as adminVerificationController from '../controllers/admin-verification-controller.js'
import { ROLES } from '../constants/enums.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'

export const adminPortalRouter = Router()

const adminGuards = [requireAuth, requireRole(ROLES.ADMIN)] as const

adminPortalRouter.get(
  '/verifications/pending-count',
  ...adminGuards,
  adminVerificationController.getPendingVerificationCount,
)
