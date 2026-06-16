import type { CookieOptions, Response } from 'express'
import { config } from '../config/env.js'
import { COOKIE_NAMES, COOKIE_PATHS } from '../constants/auth.js'
import { accessTokenMaxAgeMs, refreshTokenMaxAgeMs } from './duration.js'

function baseCookieOptions(): CookieOptions {
  const options: CookieOptions = {
    secure: config.COOKIE_SECURE,
    sameSite: config.COOKIE_SAMESITE,
  }

  if (config.COOKIE_DOMAIN) {
    options.domain = config.COOKIE_DOMAIN
  }

  return options
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  const base = baseCookieOptions()

  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...base,
    httpOnly: true,
    path: COOKIE_PATHS.ROOT,
    maxAge: accessTokenMaxAgeMs,
  })

  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...base,
    httpOnly: true,
    path: COOKIE_PATHS.AUTH,
    maxAge: refreshTokenMaxAgeMs,
  })
}

export function clearAuthCookies(res: Response) {
  const base = baseCookieOptions()

  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, {
    ...base,
    httpOnly: true,
    path: COOKIE_PATHS.ROOT,
  })

  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
    ...base,
    httpOnly: true,
    path: COOKIE_PATHS.AUTH,
  })
}

export function setCsrfCookie(res: Response, token: string) {
  const base = baseCookieOptions()

  res.cookie(COOKIE_NAMES.CSRF, token, {
    ...base,
    httpOnly: false,
    path: COOKIE_PATHS.ROOT,
    maxAge: refreshTokenMaxAgeMs,
  })
}

export function clearCsrfCookie(res: Response) {
  const base = baseCookieOptions()

  res.clearCookie(COOKIE_NAMES.CSRF, {
    ...base,
    httpOnly: false,
    path: COOKIE_PATHS.ROOT,
  })
}
