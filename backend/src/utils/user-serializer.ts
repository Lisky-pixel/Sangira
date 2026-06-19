import type { NotificationPreferences } from '../constants/notification-preferences.js'
import { resolveVerificationStatusForUser } from './resolve-verification-status.js'
import { normalizeNotificationPrefs } from './normalize-notification-prefs.js'
import { resolveAvatarUrl } from './resolve-avatar-url.js'

type SerializableUser = {
  role?: string
  notificationPrefs?: NotificationPreferences | Record<string, unknown>
  verification?: {
    status?: string
    reason?: string | null
    documents?: unknown[]
  }
  toJSON?: () => Record<string, unknown>
}

type UserJson = Record<string, unknown> & {
  avatarUrl?: string
  /** @deprecated Legacy field — mapped to avatarUrl in API responses */
  profileImageUrl?: string
  passwordChangedAt?: Date | string
  pickupAddress?: string
  pickupLocation?: {
    type?: string
    coordinates?: number[]
    address?: string
  }
}

export function serializeUser(user: SerializableUser) {
  const json: UserJson =
    typeof user.toJSON === 'function'
      ? (user.toJSON() as UserJson)
      : (user as unknown as UserJson)

  const { profileImageUrl: legacyAvatar, ...rest } = json
  const avatarUrl = resolveAvatarUrl({
    avatarUrl: rest.avatarUrl,
    profileImageUrl: legacyAvatar,
  })

  return {
    ...rest,
    ...(avatarUrl ? { avatarUrl } : {}),
    notificationPrefs: normalizeNotificationPrefs(user.notificationPrefs),
  }
}

export function getVerificationStatus(user: SerializableUser): string {
  return resolveVerificationStatusForUser(user)
}
