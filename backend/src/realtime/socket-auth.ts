import { COOKIE_NAMES } from '../constants/auth.js'
import { verifyAccessToken } from '../utils/tokens.js'

export function parseCookieHeader(
  header: string | undefined,
): Record<string, string> {
  if (!header) {
    return {}
  }

  const cookies: Record<string, string> = {}

  for (const part of header.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const name = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()
    cookies[name] = decodeURIComponent(value)
  }

  return cookies
}

export function extractAccessTokenFromCookieHeader(
  header: string | undefined,
): string | undefined {
  return parseCookieHeader(header)[COOKIE_NAMES.ACCESS_TOKEN]
}

export function authenticateSocketCookieHeader(header: string | undefined) {
  const token = extractAccessTokenFromCookieHeader(header)
  if (!token) {
    return null
  }

  try {
    const payload = verifyAccessToken(token)
    return {
      userId: payload.sub,
      role: payload.role,
    }
  } catch {
    return null
  }
}
