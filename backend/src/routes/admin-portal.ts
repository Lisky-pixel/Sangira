import { Router } from 'express'
import * as adminOverviewController from '../controllers/admin-overview-controller.js'
import * as adminVerificationController from '../controllers/admin-verification-controller.js'
import { ROLES } from '../constants/enums.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate.js'
import {
  adminVerificationIdParamSchema,
  adminVerificationsQuerySchema,
  rejectVerificationSchema,
} from '../validators/admin-verification.js'

export const adminPortalRouter = Router()

const adminGuards = [requireAuth, requireRole(ROLES.ADMIN)] as const

adminPortalRouter.get(
  '/overview',
  ...adminGuards,
  adminOverviewController.getOverviewHandler,
)

adminPortalRouter.get(
  '/verifications/pending-count',
  ...adminGuards,
  adminVerificationController.getPendingVerificationCount,
)

adminPortalRouter.get(
  '/verifications',
  ...adminGuards,
  validateQuery(adminVerificationsQuerySchema),
  adminVerificationController.listVerifications,
)

adminPortalRouter.get(
  '/verifications/:id',
  ...adminGuards,
  validateParams(adminVerificationIdParamSchema),
  adminVerificationController.getVerification,
)

adminPortalRouter.get(
  '/verifications/:id/document/view',
  ...adminGuards,
  validateParams(adminVerificationIdParamSchema),
  adminVerificationController.viewVerificationDocument,
)

adminPortalRouter.post(
  '/verifications/:id/approve',
  csrfGuard,
  ...adminGuards,
  validateParams(adminVerificationIdParamSchema),
  adminVerificationController.approveVerificationHandler,
)

adminPortalRouter.post(
  '/verifications/:id/reject',
  csrfGuard,
  ...adminGuards,
  validateParams(adminVerificationIdParamSchema),
  validateBody(rejectVerificationSchema),
  adminVerificationController.rejectVerificationHandler,
)
