import { Router } from 'express'
import { strictRateLimiter } from '../app/middleware/rate-limit.js'
import * as authController from '../controllers/auth-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import {
  requireCertificateFile,
  uploadCertificateMiddleware,
} from '../middleware/upload.js'
import { validateBody } from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../validators/auth.js'
import { unauthorized } from '../utils/app-error.js'
import { COOKIE_NAMES } from '../constants/auth.js'

export const authRouter = Router()

authRouter.use(strictRateLimiter)

authRouter.get('/csrf', authController.csrf)

authRouter.post(
  '/register',
  csrfGuard,
  uploadCertificateMiddleware,
  requireCertificateFile,
  validateBody(registerSchema),
  authController.register,
)

authRouter.post(
  '/login',
  csrfGuard,
  validateBody(loginSchema),
  authController.login,
)

authRouter.post('/refresh', csrfGuard, async (req, res, next) => {
  const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN]
  if (!refreshToken) {
    return next(unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN'))
  }
  return authController.refresh(req, res, next)
})

authRouter.post('/logout', csrfGuard, authController.logout)

authRouter.get('/me', requireAuth, authController.me)
