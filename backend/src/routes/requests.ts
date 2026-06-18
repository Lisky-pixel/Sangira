import { Router } from 'express'
import { ROLES } from '../constants/enums.js'
import * as requestController from '../controllers/request-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'
import { requireVerified } from '../middleware/require-verified.js'
import { validateBody } from '../middleware/validate.js'
import { createRequestSchema } from '../validators/request.js'

export const requestsRouter = Router()

const ngoRequestGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.NGO),
] as const

requestsRouter.post(
  '/',
  csrfGuard,
  ...ngoRequestGuards,
  validateBody(createRequestSchema),
  requestController.createRequest,
)
