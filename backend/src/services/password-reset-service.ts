import type { Request } from 'express'
import crypto from 'crypto'
import { User } from '../models/user.js'
import { PasswordResetCode } from '../models/password-reset-code.js'
import { PASSWORD_RESET } from '../constants/password-reset.js'
import { findUserByIdentifier, resolveIdentifierQuery } from '../utils/auth-identifier.js'
import { maskEmail } from '../utils/mask-email.js'
import { generateResetCode, hashResetCode } from '../utils/reset-code.js'
import { sendVerificationCodeEmail, NotificationError } from '../notifications/index.js'
import { unauthorized } from '../utils/app-error.js'
import { RefreshToken } from '../models/refresh-token.js'
import { issueAuthTokens } from './auth-service.js'
import { VERIFICATION_STATUS } from '../constants/enums.js'
import type { Role } from '../constants/enums.js'

const GENERIC_MESSAGE = 'If an account exists, a code has been sent.'
const GENERIC_MASKED_EMAIL = 'a•••@example.com'

function nowPlusMinutes(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000)
}

function secondsSince(date: Date) {
  return (Date.now() - date.getTime()) / 1000
}

export async function requestPasswordResetCode(input: { identifier: string }) {
  const resolved = resolveIdentifierQuery(input.identifier)

  // Always return the same response shape (no enumeration).
  const baseResponse = {
    message: GENERIC_MESSAGE,
    maskedEmail: GENERIC_MASKED_EMAIL,
    resendIn: PASSWORD_RESET.RESET_RESEND_COOLDOWN_SECONDS,
  }

  if (!resolved) {
    return baseResponse
  }

  const user = (await findUserByIdentifier(
    input.identifier,
    '_id email role organisationName',
  )) as (typeof User)['prototype'] | null
  if (!user) {
    return baseResponse
  }

  const latestActive = await PasswordResetCode.findOne({
    user: user._id,
    expiresAt: { $gt: new Date() },
    consumedAt: { $exists: false },
  }).sort({ createdAt: -1 })

  if (
    latestActive &&
    secondsSince(latestActive.createdAt) < PASSWORD_RESET.RESET_RESEND_COOLDOWN_SECONDS
  ) {
    return {
      ...baseResponse,
      maskedEmail: maskEmail(user.email),
    }
  }

  const code = generateResetCode()
  const codeHash = hashResetCode(code)

  await PasswordResetCode.create({
    user: user._id,
    codeHash,
    expiresAt: nowPlusMinutes(PASSWORD_RESET.RESET_CODE_TTL_MINUTES),
    attempts: 0,
  })

  try {
    await sendVerificationCodeEmail({
      to: user.email,
      code,
      organisationName:
        (user as unknown as { organisationName?: string }).organisationName ?? 'Sangira',
      ttlMinutes: PASSWORD_RESET.RESET_CODE_TTL_MINUTES,
    })
  } catch (error) {
    if (!(error instanceof NotificationError)) {
      throw error
    }
  }

  return {
    ...baseResponse,
    maskedEmail: maskEmail(user.email),
  }
}

export async function verifyPasswordResetCode(
  input: { identifier: string; code: string; newPassword: string },
  req: Request,
) {
  const resolved = resolveIdentifierQuery(input.identifier)
  if (!resolved) {
    throw unauthorized('Invalid code', 'INVALID_RESET_CODE')
  }

  const user = (await findUserByIdentifier(input.identifier, '+passwordHash')) as
    | (typeof User)['prototype']
    | null
  if (!user) {
    throw unauthorized('Invalid code', 'INVALID_RESET_CODE')
  }

  const reset = await PasswordResetCode.findOne({
    user: user._id,
    expiresAt: { $gt: new Date() },
    consumedAt: { $exists: false },
  }).sort({ createdAt: -1 })

  if (!reset) {
    throw unauthorized('Code expired', 'RESET_CODE_EXPIRED')
  }

  if (reset.attempts >= PASSWORD_RESET.RESET_MAX_VERIFY_ATTEMPTS) {
    reset.consumedAt = new Date()
    await reset.save()
    throw unauthorized('Too many attempts', 'RESET_TOO_MANY_ATTEMPTS')
  }

  const providedHash = hashResetCode(input.code)
  const valid = cryptoTimingSafeEqualHex(providedHash, reset.codeHash)

  if (!valid) {
    reset.attempts += 1
    if (reset.attempts >= PASSWORD_RESET.RESET_MAX_VERIFY_ATTEMPTS) {
      reset.consumedAt = new Date()
    }
    await reset.save()
    throw unauthorized('Invalid code', 'INVALID_RESET_CODE')
  }

  // Update password (pre-save hook will hash).
  user.passwordHash = input.newPassword
  user.passwordChangedAt = new Date()
  await user.save()

  reset.consumedAt = new Date()
  await reset.save()

  // Revoke all sessions.
  await RefreshToken.updateMany({ user: user._id }, { revoked: true })

  const tokens = await issueAuthTokens(user._id.toString(), user.role as Role, req)

  const verificationStatus =
    (user as { verification?: { status?: string } }).verification?.status ??
    VERIFICATION_STATUS.PENDING

  return { user, tokens, verificationStatus }
}

function cryptoTimingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  const aBuf = Buffer.from(a, 'hex')
  const bBuf = Buffer.from(b, 'hex')
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

