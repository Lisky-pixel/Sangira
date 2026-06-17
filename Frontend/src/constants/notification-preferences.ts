/** Mirrors backend notification preference keys */
export const NOTIFICATION_PREF_KEY = {
  NEW_REQUEST: 'newRequest',
  PICKUP_REMINDERS: 'pickupReminders',
  LISTING_EXPIRING: 'listingExpiring',
  IMPACT_SUMMARY: 'impactSummary',
} as const

export type NotificationPrefKey =
  (typeof NOTIFICATION_PREF_KEY)[keyof typeof NOTIFICATION_PREF_KEY]

export const NOTIFICATION_PREF_KEYS = Object.values(
  NOTIFICATION_PREF_KEY,
) as [NotificationPrefKey, ...NotificationPrefKey[]]

export type NotificationPreferences = Record<NotificationPrefKey, boolean>

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  [NOTIFICATION_PREF_KEY.NEW_REQUEST]: true,
  [NOTIFICATION_PREF_KEY.PICKUP_REMINDERS]: true,
  [NOTIFICATION_PREF_KEY.LISTING_EXPIRING]: true,
  [NOTIFICATION_PREF_KEY.IMPACT_SUMMARY]: false,
}
