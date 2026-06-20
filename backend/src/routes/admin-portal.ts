import { Router } from 'express'
import * as adminListingsController from '../controllers/admin-listings-controller.js'
import * as adminActivityController from '../controllers/admin-activity-controller.js'
import * as adminOverviewController from '../controllers/admin-overview-controller.js'
import * as adminUsersController from '../controllers/admin-users-controller.js'
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
import { adminActivityQuerySchema } from '../validators/admin-activity.js'
import { adminListingsQuerySchema } from '../validators/admin-listings.js'
import {
  adminUserIdParamSchema,
  adminUserOptionalReasonSchema,
  adminUserRequiredReasonSchema,
  adminUsersQuerySchema,
} from '../validators/admin-users.js'

export const adminPortalRouter = Router()

const adminGuards = [requireAuth, requireRole(ROLES.ADMIN)] as const

adminPortalRouter.get(
  '/overview',
  ...adminGuards,
  adminOverviewController.getOverviewHandler,
)

adminPortalRouter.get(
  '/activity',
  ...adminGuards,
  validateQuery(adminActivityQuerySchema),
  adminActivityController.listAdminActivityHandler,
)

adminPortalRouter.get(
  '/listings',
  ...adminGuards,
  validateQuery(adminListingsQuerySchema),
  adminListingsController.listListingsHandler,
)

adminPortalRouter.get(
  '/users',
  ...adminGuards,
  validateQuery(adminUsersQuerySchema),
  adminUsersController.listUsersHandler,
)

adminPortalRouter.get(
  '/users/:id',
  ...adminGuards,
  validateParams(adminUserIdParamSchema),
  adminUsersController.getUserHandler,
)

adminPortalRouter.get(
  '/users/:id/document/view',
  ...adminGuards,
  validateParams(adminUserIdParamSchema),
  adminUsersController.viewUserDocumentHandler,
)

adminPortalRouter.post(
  '/users/:id/flag',
  csrfGuard,
  ...adminGuards,
  validateParams(adminUserIdParamSchema),
  validateBody(adminUserOptionalReasonSchema),
  adminUsersController.flagUserHandler,
)

adminPortalRouter.post(
  '/users/:id/unflag',
  csrfGuard,
  ...adminGuards,
  validateParams(adminUserIdParamSchema),
  adminUsersController.unflagUserHandler,
)

adminPortalRouter.post(
  '/users/:id/suspend',
  csrfGuard,
  ...adminGuards,
  validateParams(adminUserIdParamSchema),
  validateBody(adminUserRequiredReasonSchema),
  adminUsersController.suspendUserHandler,
)

adminPortalRouter.post(
  '/users/:id/reactivate',
  csrfGuard,
  ...adminGuards,
  validateParams(adminUserIdParamSchema),
  adminUsersController.reactivateUserHandler,
)

adminPortalRouter.post(
  '/users/:id/restore-verification',
  csrfGuard,
  ...adminGuards,
  validateParams(adminUserIdParamSchema),
  adminUsersController.restoreVerificationHandler,
)

adminPortalRouter.post(
  '/users/:id/revoke-verification',
  csrfGuard,
  ...adminGuards,
  validateParams(adminUserIdParamSchema),
  validateBody(adminUserRequiredReasonSchema),
  adminUsersController.revokeVerificationHandler,
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
