import {
  NOTIFICATION_EVENT_KEY,
  type NotificationEventKey,
} from '../constants/notification-preferences'

export const donorSettingsContent = {
  pageTitle: 'Settings',
  pageSubtitle: 'Manage your notifications and account',
  notifications: {
    title: 'Notifications',
    subtitle: 'Choose how you hear from Sangira',
    rows: {
      [NOTIFICATION_EVENT_KEY.NEW_REQUEST]: {
        title: 'New request received',
        description: 'When an NGO requests one of your listings',
      },
      [NOTIFICATION_EVENT_KEY.PICKUP_REMINDERS]: {
        title: 'Pickup reminders',
        description: 'Before a scheduled pickup time',
      },
      [NOTIFICATION_EVENT_KEY.LISTING_EXPIRING]: {
        title: 'Listing expiring soon',
        description: 'One hour before a listing expires unmatched',
      },
      [NOTIFICATION_EVENT_KEY.IMPACT_SUMMARY]: {
        title: 'Impact summary',
        description: 'A monthly summary of your redistribution',
      },
    } satisfies Record<
      NotificationEventKey,
      { title: string; description: string }
    >,
  },
  account: {
    title: 'Account',
    language: {
      label: 'Language',
      value: 'English',
      // TODO: i18n later — language selector and locale switching
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
