import { config } from './env.js'
import { RATE_LIMIT_DEFAULTS } from '../constants/rate-limit.js'

const isProduction = config.NODE_ENV === 'production'

export const rateLimitConfig = {
  globalWindowMs: config.GLOBAL_RATE_LIMIT_WINDOW_MS,
  globalMax: isProduction
    ? config.GLOBAL_RATE_LIMIT_MAX
    : config.GLOBAL_RATE_LIMIT_MAX_DEVELOPMENT,
  authWindowMs: config.AUTH_RATE_LIMIT_WINDOW_MS,
  authSensitiveMax: isProduction
    ? config.AUTH_RATE_LIMIT_MAX
    : config.AUTH_RATE_LIMIT_MAX_DEVELOPMENT,
  authReadMax: isProduction
    ? config.AUTH_READ_RATE_LIMIT_MAX
    : config.AUTH_READ_RATE_LIMIT_MAX_DEVELOPMENT,
  devTestWindowMs: RATE_LIMIT_DEFAULTS.WINDOW_MS,
  devTestMax: RATE_LIMIT_DEFAULTS.DEV_TEST_MAX,
} as const
