import { normalizePhone } from './phone.js'
import { User } from '../models/user.js'

export type IdentifierQuery =
  | { email: string; phone?: never }
  | { phone: string; email?: never }

export function resolveIdentifierQuery(
  identifier: string,
): IdentifierQuery | null {
  const trimmed = identifier.trim()
  if (!trimmed) return null

  if (trimmed.includes('@')) {
    return { email: trimmed.toLowerCase() }
  }

  const normalizedPhone = normalizePhone(trimmed)
  if (!normalizedPhone) return null
  return { phone: normalizedPhone }
}

export async function findUserByIdentifier(
  identifier: string,
  select?: string,
): Promise<import('mongoose').HydratedDocument<unknown> | null> {
  const query = resolveIdentifierQuery(identifier)
  if (!query) return null

  if ('phone' in query) {
    const matches = await User.find({ phone: query.phone })
      .select(select ?? '')
      .limit(2)
    if (matches.length > 1) {
      console.error('Phone identifier matched multiple users', {
        phone: query.phone,
        count: matches.length,
      })
      return null
    }
    return matches[0] ?? null
  }

  return User.findOne(query).select(select ?? '')
}

