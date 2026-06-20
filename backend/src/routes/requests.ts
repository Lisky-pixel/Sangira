import { Router } from 'express'
import * as handoverController from '../controllers/handover-controller.js'
import * as requestController from '../controllers/request-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import {
  donorParticipantWriteGuards,
  handoverParticipantReadGuards,
  ngoParticipantReadGuards,
  ngoParticipantWriteGuards,
} from '../middleware/participant-guards.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import { confirmReceiptSchema } from '../validators/handover.js'
import {
  createRequestSchema,
  requestIdParamSchema,
} from '../validators/request.js'

export const requestsRouter = Router()

requestsRouter.post(
  '/',
  csrfGuard,
  ...ngoParticipantWriteGuards,
  validateBody(createRequestSchema),
  requestController.createRequest,
)

requestsRouter.get('/mine', ...ngoParticipantReadGuards, requestController.listMyRequests)

requestsRouter.get(
  '/:id/handover',
  ...handoverParticipantReadGuards,
  validateParams(requestIdParamSchema),
  handoverController.getHandover,
)

requestsRouter.post(
  '/:id/confirm-handover',
  csrfGuard,
  ...donorParticipantWriteGuards,
  validateParams(requestIdParamSchema),
  handoverController.confirmHandover,
)

requestsRouter.post(
  '/:id/confirm-receipt',
  csrfGuard,
  ...ngoParticipantWriteGuards,
  validateParams(requestIdParamSchema),
  validateBody(confirmReceiptSchema),
  handoverController.confirmReceipt,
)

requestsRouter.post(
  '/:id/accept',
  csrfGuard,
  ...donorParticipantWriteGuards,
  validateParams(requestIdParamSchema),
  requestController.acceptRequest,
)
