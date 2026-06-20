/**
 * Notification preference keys — channels (delivery) and events (triggers).
 *
 * Migration note: existing users may have legacy flat prefs (`newRequest`, `sms`,
 * `inApp`, etc. at the top level). `normalizeNotificationPrefs()` maps those into
 * `channels` + `events` on read; the next PATCH persists the nested shape.
 */

import {
  DEFAULT_ADMIN_NOTIFICATION_EVENT_PREFS,
  ADMIN_NOTIFICATION_EVENT_KEYS,
  type AdminNotificationEventPreferences,
} from './admin-notification-preferences.js'

export const NOTIFICATION_CHANNEL_KEY = {
  EMAIL: 'email',
  IN_APP: 'inApp',
  SMS: 'sms',
} as const

export type NotificationChannelKey =
  (typeof NOTIFICATION_CHANNEL_KEY)[keyof typeof NOTIFICATION_CHANNEL_KEY]

export const NOTIFICATION_CHANNEL_KEYS = Object.values(
  NOTIFICATION_CHANNEL_KEY,
) as [NotificationChannelKey, ...NotificationChannelKey[]]

export const NOTIFICATION_EVENT_KEY = {
  NEW_REQUEST: 'newRequest',
  PICKUP_REMINDERS: 'pickupReminders',
  LISTING_EXPIRING: 'listingExpiring',
  IMPACT_SUMMARY: 'impactSummary',
} as const

export type NotificationEventKey =
  (typeof NOTIFICATION_EVENT_KEY)[keyof typeof NOTIFICATION_EVENT_KEY]

export const NOTIFICATION_EVENT_KEYS = Object.values(
  NOTIFICATION_EVENT_KEY,
) as [NotificationEventKey, ...NotificationEventKey[]]

export type NotificationChannelPreferences = Record<
  NotificationChannelKey,
  boolean
>

export type NotificationEventPreferences = Record<NotificationEventKey, boolean>

export type NotificationPreferences = {
  channels: NotificationChannelPreferences
  events: NotificationEventPreferences
  adminEvents?: AdminNotificationEventPreferences
}

export { type AdminNotificationEventPreferences }

export const DEFAULT_NOTIFICATION_CHANNEL_PREFS: NotificationChannelPreferences =
  {
    [NOTIFICATION_CHANNEL_KEY.EMAIL]: true,
    [NOTIFICATION_CHANNEL_KEY.IN_APP]: true,
    [NOTIFICATION_CHANNEL_KEY.SMS]: false,
  }

export const DEFAULT_NOTIFICATION_EVENT_PREFS: NotificationEventPreferences = {
  [NOTIFICATION_EVENT_KEY.NEW_REQUEST]: true,
  [NOTIFICATION_EVENT_KEY.PICKUP_REMINDERS]: true,
  [NOTIFICATION_EVENT_KEY.LISTING_EXPIRING]: true,
  [NOTIFICATION_EVENT_KEY.IMPACT_SUMMARY]: false,
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  channels: DEFAULT_NOTIFICATION_CHANNEL_PREFS,
  events: DEFAULT_NOTIFICATION_EVENT_PREFS,
  adminEvents: { ...DEFAULT_ADMIN_NOTIFICATION_EVENT_PREFS },
}

export { ADMIN_NOTIFICATION_EVENT_KEYS }

/** @deprecated Use NOTIFICATION_EVENT_KEY */
export const NOTIFICATION_PREF_KEY = NOTIFICATION_EVENT_KEY

/** @deprecated Use NotificationEventKey */
export type NotificationPrefKey = NotificationEventKey

/** @deprecated Use NOTIFICATION_EVENT_KEYS */
export const NOTIFICATION_PREF_KEYS = NOTIFICATION_EVENT_KEYS
