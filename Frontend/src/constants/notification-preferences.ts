/** Mirrors backend notification preference shape */
import {
  DEFAULT_NGO_NOTIFICATION_EVENT_PREFS,
  type NgoNotificationEventPreferences,
} from './ngo-notification-preferences'

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
  ngoEvents?: NgoNotificationEventPreferences
}

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
  ngoEvents: { ...DEFAULT_NGO_NOTIFICATION_EVENT_PREFS },
}

/** @deprecated Use NOTIFICATION_EVENT_KEY */
export const NOTIFICATION_PREF_KEY = NOTIFICATION_EVENT_KEY

/** @deprecated Use NotificationEventKey */
export type NotificationPrefKey = NotificationEventKey

/** @deprecated Use NOTIFICATION_EVENT_KEYS */
export const NOTIFICATION_PREF_KEYS = NOTIFICATION_EVENT_KEYS
