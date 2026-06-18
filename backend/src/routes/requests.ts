import { Router } from 'express'
import { ROLES } from '../constants/enums.js'
import * as requestController from '../controllers/request-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'
import { requireVerified } from '../middleware/require-verified.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import {
  createRequestSchema,
  requestIdParamSchema,
} from '../validators/request.js'

export const requestsRouter = Router()

const ngoRequestGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.NGO),
] as const

const donorRequestGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.DONOR),
] as const

requestsRouter.post(
  '/',
  csrfGuard,
  ...ngoRequestGuards,
  validateBody(createRequestSchema),
  requestController.createRequest,
)

requestsRouter.post(
  '/:id/accept',
  csrfGuard,
  ...donorRequestGuards,
  validateParams(requestIdParamSchema),
  requestController.acceptRequest,
)
