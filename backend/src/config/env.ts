import { config as loadEnv } from 'dotenv'
import { z } from 'zod'

loadEnv()

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
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
