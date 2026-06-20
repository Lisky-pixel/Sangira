import { Router } from 'express'
import * as notificationController from '../controllers/notification-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import { participantNotificationReadGuards } from '../middleware/participant-guards.js'
import { validateParams, validateQuery } from '../middleware/validate.js'
import {
  listNotificationsQuerySchema,
  notificationIdParamSchema,
} from '../validators/notifications.js'

export const notificationsRouter = Router()

notificationsRouter.get(
  '/',
  ...participantNotificationReadGuards,
  validateQuery(listNotificationsQuerySchema),
  notificationController.listNotifications,
)

notificationsRouter.post(
  '/read-all',
  csrfGuard,
  ...participantNotificationReadGuards,
  notificationController.markAllNotificationsRead,
)

notificationsRouter.post(
  '/:id/read',
  csrfGuard,
  ...participantNotificationReadGuards,
  validateParams(notificationIdParamSchema),
  notificationController.markNotificationRead,
)
