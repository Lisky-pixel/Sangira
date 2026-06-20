import {
  NGO_NOTIFICATION_EVENT_KEY,
  type NgoNotificationEventKey,
} from '../constants/ngo-notification-preferences'

export const ngoSettingsContent = {
  pageTitle: 'Settings',
  pageSubtitle: 'Manage your notifications and account.',
  notifications: {
    title: 'Notifications',
    subtitle: 'Choose how you hear from Sangira',
    rows: {
      [NGO_NOTIFICATION_EVENT_KEY.NEW_LISTING_AVAILABLE]: {
        title: 'New listing available',
        description: 'When new food is posted you can request',
      },
      [NGO_NOTIFICATION_EVENT_KEY.REQUEST_ACCEPTED]: {
        title: 'Request accepted',
        description: 'When a donor accepts your request',
      },
      [NGO_NOTIFICATION_EVENT_KEY.PICKUP_REMINDERS]: {
        title: 'Pickup reminders',
        description: 'Before a scheduled pickup expires',
        // TODO: scheduled-notifications slice — pickup reminder delivery
      },
      [NGO_NOTIFICATION_EVENT_KEY.CAPACITY_REMINDER]: {
        title: 'Capacity reminder',
        description: 'A weekly nudge to keep your capacity current',
        // TODO: scheduled-notifications slice — capacity reminder delivery
      },
    } satisfies Record<
      NgoNotificationEventKey,
      { title: string; description: string }
    >,
  },
  account: {
    title: 'Account',
    language: {
      label: 'Language',
      value: 'English',
      comingSoon: 'More languages coming soon',
    },
    signOut: {
      label: 'Sign out of your account',
      button: 'Log out',
    },
  },
  toast: {
    preferenceSaved: 'Preference updated',
    preferenceError: 'Could not update preference',
  },
} as const
