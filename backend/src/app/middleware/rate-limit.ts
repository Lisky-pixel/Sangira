import rateLimit, {
  type Options,
  type RateLimitExceededEventHandler,
} from 'express-rate-limit'
import { rateLimitConfig } from '../../config/rate-limit.js'
import {
  RATE_LIMIT_CODES,
  RATE_LIMIT_MESSAGES,
} from '../../constants/rate-limit.js'
import { sendError } from '../../utils/response.js'

function rateLimitExceededHandler(
  code: string,
  message: string,
): RateLimitExceededEventHandler {
  return (_req, res, _next, options) => {
    if (!res.getHeader('Retry-After')) {
      res.setHeader(
        'Retry-After',
        String(Math.max(1, Math.ceil(options.windowMs / 1000))),
      )
    }
    return sendError(res, message, code, options.statusCode ?? 429)
  }
}

function createLimiter(options: Partial<Options>): ReturnType<typeof rateLimit> {
  return rateLimit({
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    ...options,
  })
}

export const globalRateLimiter = createLimiter({
  windowMs: rateLimitConfig.globalWindowMs,
  max: rateLimitConfig.globalMax,
  handler: rateLimitExceededHandler(
    RATE_LIMIT_CODES.RATE_LIMIT_EXCEEDED,
    RATE_LIMIT_MESSAGES.TOO_MANY_REQUESTS,
  ),
})

/** Brute-force protection for sensitive auth POSTs (login, register, password reset/change). */
export const authSensitiveRateLimiter = createLimiter({
  windowMs: rateLimitConfig.authWindowMs,
  max: rateLimitConfig.authSensitiveMax,
  handler: rateLimitExceededHandler(
    RATE_LIMIT_CODES.AUTH_RATE_LIMIT_EXCEEDED,
    RATE_LIMIT_MESSAGES.TOO_MANY_ATTEMPTS_WAIT,
  ),
})

/** High-frequency safe auth reads (GET /auth/csrf, GET /auth/me) and routine session POSTs. */
export const authReadRateLimiter = createLimiter({
  windowMs: rateLimitConfig.authWindowMs,
  max: rateLimitConfig.authReadMax,
  handler: rateLimitExceededHandler(
    RATE_LIMIT_CODES.RATE_LIMIT_EXCEEDED,
    RATE_LIMIT_MESSAGES.TOO_MANY_REQUESTS,
  ),
})

/** @deprecated Use authSensitiveRateLimiter — kept for any lingering imports */
export const strictRateLimiter = authSensitiveRateLimiter

/** Very low ceiling for /dev test routes — never enabled in production */
export const devTestRateLimiter = createLimiter({
  windowMs: rateLimitConfig.devTestWindowMs,
  max: rateLimitConfig.devTestMax,
  handler: rateLimitExceededHandler(
    RATE_LIMIT_CODES.DEV_RATE_LIMIT_EXCEEDED,
    RATE_LIMIT_MESSAGES.TOO_MANY_REQUESTS,
  ),
})
