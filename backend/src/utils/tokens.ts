import crypto from 'crypto'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { config } from '../config/env.js'
import type { Role } from '../constants/enums.js'
import { accessTokenMaxAgeMs } from './duration.js'

export type AccessTokenPayload = {
  sub: string
  role: Role
}

export function signAccessToken(userId: string, role: Role): string {
  const payload: AccessTokenPayload = {
    sub: userId,
    role,
  }

  const options: SignOptions = {
    expiresIn: config.ACCESS_TOKEN_TTL as SignOptions['expiresIn'],
  }

  return jwt.sign(payload, config.JWT_ACCESS_SECRET, options)
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, config.JWT_ACCESS_SECRET) as AccessTokenPayload
}

export function generateOpaqueToken(): string {
  return crypto.randomBytes(48).toString('hex')
}

export function hashOpaqueToken(token: string): string {
  return crypto
    .createHmac('sha256', config.JWT_REFRESH_SECRET)
    .update(token)
    .digest('hex')
}

export function generateFamilyId(): string {
  return crypto.randomUUID()
}

export function getAccessTokenMaxAgeMs(): number {
  return accessTokenMaxAgeMs
}
