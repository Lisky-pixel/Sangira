import { ROUTES } from '../routes/paths'
import { ADMIN_NOTIFICATION_EVENT_KEY } from '../constants/admin-notification-preferences'

export const adminSettingsContent = {
  pageTitle: 'Settings',
  pageSubtitle: 'Manage your notifications and platform preferences.',
  loading: 'Loading settings…',
  loadError: 'Could not load settings. Please try again.',
  notifications: {
    title: 'Notifications',
    subtitle: 'Choose which alerts you receive.',
    rows: {
      [ADMIN_NOTIFICATION_EVENT_KEY.NEW_VERIFICATION_SUBMITTED]: {
        title: 'New verification submitted',
        description:
          'When an organisation submits documents for review.',
      },
      [ADMIN_NOTIFICATION_EVENT_KEY.VERIFICATION_SLA_BREACH]: {
        title: 'Verification SLA breach',
        description: (hours: number) =>
          `When an application has waited over ${hours} hours.`,
      },
      [ADMIN_NOTIFICATION_EVENT_KEY.FLAGGED_ACTIVITY]: {
        title: 'Flagged activity',
        description:
          'When the system detects an anomaly like unconfirmed pickups.',
      },
      [ADMIN_NOTIFICATION_EVENT_KEY.WEEKLY_SUMMARY_EMAIL]: {
        title: 'Weekly summary email',
        description: 'A digest of platform activity every Monday.',
      },
    },
  },
  platform: {
    title: 'Platform preferences',
    subtitle: 'Configure global system defaults.',
    slaTarget: {
      label: 'Verification SLA target',
      description: 'Hours before an application is marked overdue.',
      unit: 'hours',
    },
  },
  account: {
    title: 'Account',
    language: {
      label: 'Language',
      value: 'English',
      comingSoon: 'More languages coming soon',
    },
    signOut: {
      label: 'Sign out of your admin account',
      description: 'End current session on this device.',
      button: 'Log out',
    },
  },
  toast: {
    preferenceSaved: 'Preference saved.',
    preferenceError: 'Could not save preference. Please try again.',
    slaSaved: 'SLA target updated.',
    slaError: 'Could not update SLA target. Please try again.',
  },
  routes: {
    profile: ROUTES.ADMIN_PROFILE,
  },
} as const
