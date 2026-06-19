import { Router } from 'express'
import * as donorImpactController from '../controllers/donor-impact-controller.js'
import { ROLES } from '../constants/enums.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'
import { requireVerified } from '../middleware/require-verified.js'
import { validateQuery } from '../middleware/validate.js'
import { donorActivityQuerySchema } from '../validators/donor-activity.js'

export const impactRouter = Router()

const donorImpactGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.DONOR),
] as const

impactRouter.get('/donor', ...donorImpactGuards, donorImpactController.getDonorImpact)

export const dashboardRouter = Router()

dashboardRouter.get(
  '/donor',
  ...donorImpactGuards,
  donorImpactController.getDonorDashboard,
)

dashboardRouter.get(
  '/donor/activity',
  ...donorImpactGuards,
  validateQuery(donorActivityQuerySchema),
  donorImpactController.getDonorActivity,
)
