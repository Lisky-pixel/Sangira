import { VERIFICATION_STATUS } from '../constants/enums.js'

type SerializableUser = {
  verification?: { status?: string }
  toJSON?: () => Record<string, unknown>
}

export function serializeUser(user: SerializableUser) {
  if (typeof user.toJSON === 'function') {
    return user.toJSON()
  }

  return user as unknown as Record<string, unknown>
}

export function getVerificationStatus(user: SerializableUser): string {
  return user.verification?.status ?? VERIFICATION_STATUS.PENDING
}
