import { Router } from 'express'
import { devTestRateLimiter } from '../app/middleware/rate-limit.js'
import { validateBody } from '../middleware/validate.js'
import * as devNotificationsController from '../controllers/dev-notifications-controller.js'
import { devNotificationsTestSchema } from '../validators/dev-notifications.js'

export const devNotificationsRouter = Router()

devNotificationsRouter.post(
  '/test',
  devTestRateLimiter,
  validateBody(devNotificationsTestSchema),
  devNotificationsController.test,
)

