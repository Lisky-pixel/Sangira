import { config as loadEnv } from 'dotenv'
import { z } from 'zod'
import { GOOGLE_MAPS_API_KEY_MISSING_MESSAGE } from '../constants/geocoder.js'
import { RATE_LIMIT_DEFAULTS } from '../constants/rate-limit.js'

loadEnv()

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    CLIENT_URL: z
      .string()
      .min(1, 'CLIENT_URL is required')
      .superRefine((value, ctx) => {
        const origins = value
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean)

        if (origins.length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: 'CLIENT_URL is required',
          })
          return
        }

        for (const origin of origins) {
          const parsed = z.string().url().safeParse(origin)
          if (!parsed.success) {
            ctx.addIssue({
              code: 'custom',
              message: `CLIENT_URL contains an invalid URL origin: ${origin}`,
            })
          }
        }
      }),
    BREVO_API_KEY: z.string().min(1, 'BREVO_API_KEY is required'),
    EMAIL_FROM_ADDRESS: z
      .string()
      .email('EMAIL_FROM_ADDRESS must be a valid email address'),
    EMAIL_FROM_NAME: z.string().min(1).default('Sangira'),
    JWT_ACCESS_SECRET: z
      .string()
      .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
    JWT_REFRESH_SECRET: z
      .string()
      .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
    ACCESS_TOKEN_TTL: z.string().default('15m'),
    REFRESH_TOKEN_TTL: z.string().default('7d'),
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
    COOKIE_DOMAIN: z.string().optional(),
    COOKIE_SAMESITE: z.enum(['strict', 'lax', 'none']).default('lax'),
    COOKIE_SECURE: z
      .union([z.boolean(), z.enum(['true', 'false'])])
      .optional(),
    CLOUDINARY_CLOUD_NAME: z
      .string()
      .min(1, 'CLOUDINARY_CLOUD_NAME is required'),
    CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
    CLOUDINARY_API_SECRET: z
      .string()
      .min(1, 'CLOUDINARY_API_SECRET is required'),
    CSRF_SECRET: z
      .string()
      .min(32, 'CSRF_SECRET must be at least 32 characters'),
    GEOCODER: z
      .enum(['nominatim', 'google'])
      .default('nominatim'),
    GOOGLE_MAPS_API_KEY: z.string().optional(),
    GLOBAL_RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(RATE_LIMIT_DEFAULTS.WINDOW_MS),
    GLOBAL_RATE_LIMIT_MAX: z.coerce
      .number()
      .int()
      .positive()
      .default(RATE_LIMIT_DEFAULTS.GLOBAL_MAX_PRODUCTION),
    GLOBAL_RATE_LIMIT_MAX_DEVELOPMENT: z.coerce
      .number()
      .int()
      .positive()
      .default(RATE_LIMIT_DEFAULTS.GLOBAL_MAX_DEVELOPMENT),
    AUTH_RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(RATE_LIMIT_DEFAULTS.WINDOW_MS),
    AUTH_RATE_LIMIT_MAX: z.coerce
      .number()
      .int()
      .positive()
      .default(RATE_LIMIT_DEFAULTS.AUTH_SENSITIVE_MAX_PRODUCTION),
    AUTH_RATE_LIMIT_MAX_DEVELOPMENT: z.coerce
      .number()
      .int()
      .positive()
      .default(RATE_LIMIT_DEFAULTS.AUTH_SENSITIVE_MAX_DEVELOPMENT),
    AUTH_READ_RATE_LIMIT_MAX: z.coerce
      .number()
      .int()
      .positive()
      .default(RATE_LIMIT_DEFAULTS.AUTH_READ_MAX_PRODUCTION),
    AUTH_READ_RATE_LIMIT_MAX_DEVELOPMENT: z.coerce
      .number()
      .int()
      .positive()
      .default(RATE_LIMIT_DEFAULTS.AUTH_READ_MAX_DEVELOPMENT),
  })
  .superRefine((env, ctx) => {
    if (env.GEOCODER === 'google' && !env.GOOGLE_MAPS_API_KEY?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: GOOGLE_MAPS_API_KEY_MISSING_MESSAGE,
        path: ['GOOGLE_MAPS_API_KEY'],
      })
    }
  })
  .transform((env) => {
    const isProduction = env.NODE_ENV === 'production'
    const cookieSecure =
      env.COOKIE_SECURE === undefined
        ? isProduction
        : env.COOKIE_SECURE === true || env.COOKIE_SECURE === 'true'

    return {
      ...env,
      COOKIE_SECURE: cookieSecure,
    }
  })

function parseEnv() {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')

    console.error('Environment validation failed:\n%s', formatted)
    process.exit(1)
  }

  return result.data
}

export const config = parseEnv()

export type AppConfig = typeof config
