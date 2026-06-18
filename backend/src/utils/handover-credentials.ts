import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { config } from '../config/env.js'
import { HANDOVER } from '../constants/handover.js'
import { generateOpaqueToken } from './tokens.js'

export function generatePickupPin(): string {
  const max = 10 ** HANDOVER.PICKUP_PIN_LENGTH
  const value = crypto.randomInt(0, max)
  return String(value).padStart(HANDOVER.PICKUP_PIN_LENGTH, '0')
}

export function generateHandoverQrToken(): string {
  return generateOpaqueToken()
}

export async function hashPickupPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, config.BCRYPT_SALT_ROUNDS)
}

export async function verifyPickupPin(
  pin: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}
