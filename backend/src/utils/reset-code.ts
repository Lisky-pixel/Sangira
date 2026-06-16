import crypto from 'crypto'
import { config } from '../config/env.js'
import { PASSWORD_RESET } from '../constants/password-reset.js'

export function generateResetCode(): string {
  const max = 10 ** PASSWORD_RESET.RESET_CODE_LENGTH
  const value = crypto.randomInt(0, max)
  return String(value).padStart(PASSWORD_RESET.RESET_CODE_LENGTH, '0')
}

export function hashResetCode(code: string): string {
  return crypto
    .createHmac('sha256', config.JWT_ACCESS_SECRET)
    .update(code)
    .digest('hex')
}

