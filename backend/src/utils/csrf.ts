import crypto from 'crypto'
import { config } from '../config/env.js'

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function signCsrfToken(token: string): string {
  return crypto.createHmac('sha256', config.CSRF_SECRET).update(token).digest('hex')
}

export function verifyCsrfToken(token: string, signature: string): boolean {
  const expected = signCsrfToken(token)
  const expectedBuffer = Buffer.from(expected)
  const signatureBuffer = Buffer.from(signature)

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
}

export function createCsrfPair(): { token: string; signed: string } {
  const token = generateCsrfToken()
  return { token, signed: signCsrfToken(token) }
}

export function formatCsrfCookie(token: string, signature: string): string {
  return `${token}.${signature}`
}

export function parseCsrfCookie(cookieValue: string): string | null {
  const separatorIndex = cookieValue.lastIndexOf('.')
  if (separatorIndex <= 0) return null

  const token = cookieValue.slice(0, separatorIndex)
  const signature = cookieValue.slice(separatorIndex + 1)

  if (!token || !signature) return null
  if (!verifyCsrfToken(token, signature)) return null

  return token
}
