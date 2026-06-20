import { Router } from 'express'
import * as notificationController from '../controllers/notification-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import {
  donorParticipantReadGuards,
} from '../middleware/participant-guards.js'
import { validateParams, validateQuery } from '../middleware/validate.js'
import {
  listNotificationsQuerySchema,
  notificationIdParamSchema,
} from '../validators/notifications.js'

export const notificationsRouter = Router()

notificationsRouter.get(
  '/',
  ...donorParticipantReadGuards,
  validateQuery(listNotificationsQuerySchema),
  notificationController.listNotifications,
)

notificationsRouter.post(
  '/read-all',
  csrfGuard,
  ...donorParticipantReadGuards,
  notificationController.markAllNotificationsRead,
)

notificationsRouter.post(
  '/:id/read',
  csrfGuard,
  ...donorParticipantReadGuards,
  validateParams(notificationIdParamSchema),
  notificationController.markNotificationRead,
)
