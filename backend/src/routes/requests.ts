import { Router } from 'express'
import { ROLES } from '../constants/enums.js'
import * as handoverController from '../controllers/handover-controller.js'
import * as requestController from '../controllers/request-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'
import { requireVerified } from '../middleware/require-verified.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import { confirmReceiptSchema } from '../validators/handover.js'
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

const handoverParticipantGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.DONOR, ROLES.NGO),
] as const

requestsRouter.post(
  '/',
  csrfGuard,
  ...ngoRequestGuards,
  validateBody(createRequestSchema),
  requestController.createRequest,
)

requestsRouter.get('/mine', ...ngoRequestGuards, requestController.listMyRequests)

requestsRouter.get(
  '/:id/handover',
  ...handoverParticipantGuards,
  validateParams(requestIdParamSchema),
  handoverController.getHandover,
)

requestsRouter.post(
  '/:id/confirm-handover',
  csrfGuard,
  ...donorRequestGuards,
  validateParams(requestIdParamSchema),
  handoverController.confirmHandover,
)

requestsRouter.post(
  '/:id/confirm-receipt',
  csrfGuard,
  ...ngoRequestGuards,
  validateParams(requestIdParamSchema),
  validateBody(confirmReceiptSchema),
  handoverController.confirmReceipt,
)

requestsRouter.post(
  '/:id/accept',
  csrfGuard,
  ...donorRequestGuards,
  validateParams(requestIdParamSchema),
  requestController.acceptRequest,
)
