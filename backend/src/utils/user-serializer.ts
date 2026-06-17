import { VERIFICATION_STATUS } from '../constants/enums.js'
import type { NotificationPreferences } from '../constants/notification-preferences.js'
import { normalizeNotificationPrefs } from './normalize-notification-prefs.js'

type SerializableUser = {
  notificationPrefs?: Partial<NotificationPreferences>
  verification?: {
    status?: string
    reason?: string | null
    documents?: unknown[]
  }
  toJSON?: () => Record<string, unknown>
}

export function serializeUser(user: SerializableUser) {
  const json =
    typeof user.toJSON === 'function'
      ? user.toJSON()
      : (user as unknown as Record<string, unknown>)

  return {
    ...json,
    notificationPrefs: normalizeNotificationPrefs(user.notificationPrefs),
  }
}

export function getVerificationStatus(user: SerializableUser): string {
  return user.verification?.status ?? VERIFICATION_STATUS.PENDING
}
