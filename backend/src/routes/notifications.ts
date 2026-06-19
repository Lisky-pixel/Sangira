import { Router } from 'express'
import * as notificationController from '../controllers/notification-controller.js'
import { ROLES } from '../constants/enums.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'
import { requireVerified } from '../middleware/require-verified.js'
import { validateParams, validateQuery } from '../middleware/validate.js'
import {
  listNotificationsQuerySchema,
  notificationIdParamSchema,
} from '../validators/notifications.js'

export const notificationsRouter = Router()

const donorNotificationGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.DONOR),
] as const

notificationsRouter.get(
  '/',
  ...donorNotificationGuards,
  validateQuery(listNotificationsQuerySchema),
  notificationController.listNotifications,
)

notificationsRouter.post(
  '/read-all',
  csrfGuard,
  ...donorNotificationGuards,
  notificationController.markAllNotificationsRead,
)

notificationsRouter.post(
  '/:id/read',
  csrfGuard,
  ...donorNotificationGuards,
  validateParams(notificationIdParamSchema),
  notificationController.markNotificationRead,
)
