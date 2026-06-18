import { Router } from 'express'
import { strictRateLimiter } from '../app/middleware/rate-limit.js'
import * as authController from '../controllers/auth-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import {
  requireCertificateFile,
  uploadCertificateMiddleware,
  requireAvatarPhoto,
  uploadAvatarPhotoMiddleware,
} from '../middleware/upload.js'
import { validateBody } from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../validators/auth.js'
import { updateNotificationPreferencesSchema } from '../validators/notification-preferences.js'
import { patchProfileSchema } from '../validators/profile.js'
import {
  passwordRequestCodeSchema,
  passwordVerifySchema,
} from '../validators/password-reset.js'
import { unauthorized } from '../utils/app-error.js'
import { COOKIE_NAMES } from '../constants/auth.js'
import * as passwordResetController from '../controllers/password-reset-controller.js'
import * as profileController from '../controllers/profile-controller.js'

export const authRouter = Router()

authRouter.get('/csrf', authController.csrf)

authRouter.post(
  '/register',
  strictRateLimiter,
  csrfGuard,
  uploadCertificateMiddleware,
  requireCertificateFile,
  validateBody(registerSchema),
  authController.register,
)

authRouter.post(
  '/login',
  strictRateLimiter,
  csrfGuard,
  validateBody(loginSchema),
  authController.login,
)

authRouter.post(
  '/password/request-code',
  strictRateLimiter,
  csrfGuard,
  validateBody(passwordRequestCodeSchema),
  passwordResetController.requestCode,
)

authRouter.post(
  '/password/verify',
  strictRateLimiter,
  csrfGuard,
  validateBody(passwordVerifySchema),
  passwordResetController.verify,
)

authRouter.post('/refresh', strictRateLimiter, csrfGuard, async (req, res, next) => {
  const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN]
  if (!refreshToken) {
    return next(unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN'))
  }
  return authController.refresh(req, res, next)
})

authRouter.post('/logout', strictRateLimiter, csrfGuard, authController.logout)

authRouter.get('/me', requireAuth, authController.me)

authRouter.patch(
  '/me/notification-preferences',
  csrfGuard,
  requireAuth,
  validateBody(updateNotificationPreferencesSchema),
  authController.patchNotificationPreferences,
)

authRouter.patch(
  '/me/profile',
  csrfGuard,
  requireAuth,
  validateBody(patchProfileSchema),
  profileController.patchProfile,
)

authRouter.patch(
  '/me/avatar',
  csrfGuard,
  requireAuth,
  uploadAvatarPhotoMiddleware,
  requireAvatarPhoto,
  profileController.patchAvatar,
)
