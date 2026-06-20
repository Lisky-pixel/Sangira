/** Mirrors backend NGO notification preference keys */
export const NGO_NOTIFICATION_EVENT_KEY = {
  NEW_LISTING_AVAILABLE: 'newListingAvailable',
  REQUEST_ACCEPTED: 'requestAccepted',
  PICKUP_REMINDERS: 'pickupReminders',
  CAPACITY_REMINDER: 'capacityReminder',
} as const

export type NgoNotificationEventKey =
  (typeof NGO_NOTIFICATION_EVENT_KEY)[keyof typeof NGO_NOTIFICATION_EVENT_KEY]

export const NGO_NOTIFICATION_EVENT_KEYS = Object.values(
  NGO_NOTIFICATION_EVENT_KEY,
) as [NgoNotificationEventKey, ...NgoNotificationEventKey[]]

export type NgoNotificationEventPreferences = Record<
  NgoNotificationEventKey,
  boolean
>

export const DEFAULT_NGO_NOTIFICATION_EVENT_PREFS: NgoNotificationEventPreferences =
  {
    [NGO_NOTIFICATION_EVENT_KEY.NEW_LISTING_AVAILABLE]: true,
    [NGO_NOTIFICATION_EVENT_KEY.REQUEST_ACCEPTED]: true,
    [NGO_NOTIFICATION_EVENT_KEY.PICKUP_REMINDERS]: true,
    [NGO_NOTIFICATION_EVENT_KEY.CAPACITY_REMINDER]: false,
  }
