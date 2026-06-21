import { Router } from 'express'
import * as transferReceiptController from '../controllers/transfer-receipt-controller.js'
import { requireAuth } from '../middleware/require-auth.js'
import { validateParams } from '../middleware/validate.js'
import { requestIdParamSchema } from '../validators/request.js'

export const transfersRouter = Router()

transfersRouter.get(
  '/:id/receipt',
  requireAuth,
  validateParams(requestIdParamSchema),
  transferReceiptController.getReceipt,
)
