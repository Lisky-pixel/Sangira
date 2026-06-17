import {
  DEFAULT_NOTIFICATION_PREFS,
  NOTIFICATION_PREF_KEYS,
  type NotificationPreferences,
} from '../constants/notification-preferences.js'

export function normalizeNotificationPrefs(
  prefs: Partial<NotificationPreferences> | null | undefined,
): NotificationPreferences {
  const normalized = { ...DEFAULT_NOTIFICATION_PREFS }

  if (!prefs) {
    return normalized
  }

  for (const key of NOTIFICATION_PREF_KEYS) {
    if (typeof prefs[key] === 'boolean') {
      normalized[key] = prefs[key]
    }
  }

  return normalized
}
