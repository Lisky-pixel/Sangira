import type { Request, Response, NextFunction } from 'express'
import {
  getCurrentUser,
  loginUser,
  logoutSession,
  refreshSession,
  registerUser,
} from '../services/auth-service.js'
import { updateNotificationPreferencesForUser } from '../services/notification-preferences-service.js'
import { COOKIE_NAMES } from '../constants/auth.js'
import { clearAuthCookies, setAuthCookies, setCsrfCookie } from '../utils/cookies.js'
import {
  createCsrfPair,
  formatCsrfCookie,
} from '../utils/csrf.js'
import { sendSuccess } from '../utils/response.js'
import { getVerificationStatus, serializeUser } from '../utils/user-serializer.js'

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await registerUser(req.body, req.file!, req)
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken)

    return sendSuccess(
      res,
      {
        user: serializeUser(result.user),
        verificationStatus: result.verificationStatus,
      },
      201,
    )
  } catch (error) {
    return next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body, req)
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken)

    return sendSuccess(res, {
      user: serializeUser(result.user),
      verificationStatus: result.verificationStatus,
    })
  } catch (error) {
    return next(error)
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] as string

    const result = await refreshSession(refreshToken, req)
    setAuthCookies(res, result.accessToken, result.refreshToken)

    return sendSuccess(res, {
      user: serializeUser(result.user),
      verificationStatus: getVerificationStatus(result.user),
    })
  } catch (error) {
    return next(error)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] as
      | string
      | undefined

    await logoutSession(refreshToken)
    clearAuthCookies(res)

    return sendSuccess(res, { loggedOut: true })
  } catch (error) {
    return next(error)
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getCurrentUser(req.auth!.userId)

    return sendSuccess(res, {
      user: serializeUser(result.user),
      verificationStatus: result.verificationStatus,
      accountStatus: result.accountStatus,
    })
  } catch (error) {
    return next(error)
  }
}

export async function patchNotificationPreferences(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const notificationPrefs = await updateNotificationPreferencesForUser({
      userId: req.auth!.userId,
      patch: req.body,
    })

    return sendSuccess(res, { notificationPrefs })
  } catch (error) {
    return next(error)
  }
}

export function csrf(_req: Request, res: Response) {
  const { token, signed } = createCsrfPair()
  setCsrfCookie(res, formatCsrfCookie(token, signed))

  return sendSuccess(res, { csrfToken: token })
}
