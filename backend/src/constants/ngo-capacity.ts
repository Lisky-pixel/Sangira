import { DAILY_CAPACITY_MIN } from './ngo-registration.js'

export const DAILY_CAPACITY_MAX = 10_000

export const DAILY_CAPACITY_DEFAULT = 120

export const DEFAULT_PICKUP_HOURS = {
  FROM: '08:00',
  TO: '18:00',
} as const

export const PICKUP_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export { DAILY_CAPACITY_MIN }
