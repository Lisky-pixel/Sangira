import { Router } from 'express'
import * as ngoDashboardController from '../controllers/ngo-dashboard-controller.js'
import * as ngoImpactController from '../controllers/ngo-impact-controller.js'
import { ngoParticipantReadGuards } from '../middleware/participant-guards.js'

export const ngoDashboardRouter = Router()

ngoDashboardRouter.get(
  '/ngo',
  ...ngoParticipantReadGuards,
  ngoDashboardController.getNgoDashboard,
)

export const ngoImpactRouter = Router()

ngoImpactRouter.get(
  '/ngo',
  ...ngoParticipantReadGuards,
  ngoImpactController.getNgoImpact,
)
