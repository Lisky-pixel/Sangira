import { Router } from 'express'
import * as ngoDashboardController from '../controllers/ngo-dashboard-controller.js'
import { ROLES } from '../constants/enums.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'
import { requireVerified } from '../middleware/require-verified.js'

export const ngoDashboardRouter = Router()

const ngoDashboardGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.NGO),
] as const

ngoDashboardRouter.get(
  '/ngo',
  ...ngoDashboardGuards,
  ngoDashboardController.getNgoDashboard,
)
