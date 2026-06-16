import { Router } from 'express'
import * as verificationController from '../controllers/verification-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import {
  requireCertificateFile,
  uploadCertificateMiddleware,
} from '../middleware/upload.js'
import { globalRateLimiter } from '../app/middleware/rate-limit.js'

export const verificationRouter = Router()

verificationRouter.use(globalRateLimiter)

verificationRouter.get(
  '/document/view',
  requireAuth,
  verificationController.viewDocument,
)

verificationRouter.post(
  '/resubmit',
  csrfGuard,
  requireAuth,
  uploadCertificateMiddleware,
  requireCertificateFile,
  verificationController.resubmit,
)
