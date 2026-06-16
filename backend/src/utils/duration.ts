import ms from 'ms'
import { config } from '../config/env.js'

export function parseDurationToMs(duration: string, label: string): number {
  const value = ms(duration as ms.StringValue)

  if (value === undefined) {
    throw new Error(`Invalid ${label} duration: ${duration}`)
  }

  return value
}

export const accessTokenMaxAgeMs = parseDurationToMs(
  config.ACCESS_TOKEN_TTL,
  'ACCESS_TOKEN_TTL',
)

export const refreshTokenMaxAgeMs = parseDurationToMs(
  config.REFRESH_TOKEN_TTL,
  'REFRESH_TOKEN_TTL',
)
