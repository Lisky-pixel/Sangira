import rateLimit from 'express-rate-limit'
import { RATE_LIMIT } from '../../constants/enums.js'

export const globalRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.GLOBAL_WINDOW_MS,
  max: RATE_LIMIT.GLOBAL_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
})

/** Low ceiling for /auth routes — wired in B2 */
export const strictRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.STRICT_WINDOW_MS,
  max: RATE_LIMIT.STRICT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again later',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
    },
  },
})
