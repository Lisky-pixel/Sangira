import {
  DEFAULT_NOTIFICATION_PREFS,
  NOTIFICATION_CHANNEL_KEYS,
  NOTIFICATION_EVENT_KEYS,
  type NotificationChannelKey,
  type NotificationChannelPreferences,
  type NotificationEventKey,
  type NotificationEventPreferences,
  type NotificationPreferences,
} from '../constants/notification-preferences.js'

type LegacyNotificationPrefs = {
  channels?: Partial<NotificationChannelPreferences>
  events?: Partial<NotificationEventPreferences>
  sms?: boolean
  inApp?: boolean
  email?: boolean
} & Partial<NotificationEventPreferences>

function hasLegacyFlatEventKeys(prefs: LegacyNotificationPrefs): boolean {
  return NOTIFICATION_EVENT_KEYS.some((key) => key in prefs)
}

function mergeChannelPrefs(
  target: NotificationChannelPreferences,
  source: LegacyNotificationPrefs,
): void {
  if (source.channels) {
    for (const key of NOTIFICATION_CHANNEL_KEYS) {
      if (typeof source.channels[key] === 'boolean') {
        target[key] = source.channels[key]
      }
    }
    return
  }

  if (typeof source.email === 'boolean') {
    target.email = source.email
  }

  if (typeof source.inApp === 'boolean') {
    target.inApp = source.inApp
  }

  if (typeof source.sms === 'boolean') {
    target.sms = source.sms
  }
}

function mergeEventPrefs(
  target: NotificationEventPreferences,
  source: LegacyNotificationPrefs,
): void {
  if (source.events) {
    for (const key of NOTIFICATION_EVENT_KEYS) {
      if (typeof source.events[key] === 'boolean') {
        target[key] = source.events[key]
      }
    }
    return
  }

  if (!hasLegacyFlatEventKeys(source)) {
    return
  }

  for (const key of NOTIFICATION_EVENT_KEYS) {
    if (typeof source[key] === 'boolean') {
      target[key] = source[key]
    }
  }
}

export function normalizeNotificationPrefs(
  prefs: LegacyNotificationPrefs | null | undefined,
): NotificationPreferences {
  const normalized: NotificationPreferences = {
    channels: { ...DEFAULT_NOTIFICATION_PREFS.channels },
    events: { ...DEFAULT_NOTIFICATION_PREFS.events },
  }

  if (!prefs) {
    return normalized
  }

  mergeChannelPrefs(normalized.channels, prefs)
  mergeEventPrefs(normalized.events, prefs)

  return normalized
}

export function mergeNotificationPrefs(
  current: NotificationPreferences,
  patch: {
    channels?: Partial<NotificationChannelPreferences>
    events?: Partial<NotificationEventPreferences>
  },
): NotificationPreferences {
  return {
    channels: {
      ...current.channels,
      ...patch.channels,
    },
    events: {
      ...current.events,
      ...patch.events,
    },
  }
}

export type {
  NotificationChannelKey,
  NotificationEventKey,
  NotificationPreferences,
}
