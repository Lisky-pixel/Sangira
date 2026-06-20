import { Router } from 'express'
import * as donorImpactController from '../controllers/donor-impact-controller.js'
import { donorParticipantReadGuards } from '../middleware/participant-guards.js'
import { validateQuery } from '../middleware/validate.js'
import { donorActivityQuerySchema } from '../validators/donor-activity.js'

export const impactRouter = Router()

impactRouter.get(
  '/donor',
  ...donorParticipantReadGuards,
  donorImpactController.getDonorImpact,
)

export const dashboardRouter = Router()

dashboardRouter.get(
  '/donor',
  ...donorParticipantReadGuards,
  donorImpactController.getDonorDashboard,
)

dashboardRouter.get(
  '/donor/activity',
  ...donorParticipantReadGuards,
  validateQuery(donorActivityQuerySchema),
  donorImpactController.getDonorActivity,
)
