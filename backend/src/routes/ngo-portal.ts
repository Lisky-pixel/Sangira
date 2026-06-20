import { Router } from 'express'
import * as ngoDashboardController from '../controllers/ngo-dashboard-controller.js'
import { ngoParticipantReadGuards } from '../middleware/participant-guards.js'

export const ngoDashboardRouter = Router()

ngoDashboardRouter.get(
  '/ngo',
  ...ngoParticipantReadGuards,
  ngoDashboardController.getNgoDashboard,
)
