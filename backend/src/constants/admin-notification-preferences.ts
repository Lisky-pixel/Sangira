export const ADMIN_NOTIFICATION_EVENT_KEY = {
  NEW_VERIFICATION_SUBMITTED: 'newVerificationSubmitted',
  VERIFICATION_SLA_BREACH: 'verificationSlaBreach',
  FLAGGED_ACTIVITY: 'flaggedActivity',
  WEEKLY_SUMMARY_EMAIL: 'weeklySummaryEmail',
} as const

export type AdminNotificationEventKey =
  (typeof ADMIN_NOTIFICATION_EVENT_KEY)[keyof typeof ADMIN_NOTIFICATION_EVENT_KEY]

export const ADMIN_NOTIFICATION_EVENT_KEYS = Object.values(
  ADMIN_NOTIFICATION_EVENT_KEY,
) as [AdminNotificationEventKey, ...AdminNotificationEventKey[]]

export type AdminNotificationEventPreferences = Record<
  AdminNotificationEventKey,
  boolean
>

export const DEFAULT_ADMIN_NOTIFICATION_EVENT_PREFS: AdminNotificationEventPreferences =
  {
    [ADMIN_NOTIFICATION_EVENT_KEY.NEW_VERIFICATION_SUBMITTED]: true,
    [ADMIN_NOTIFICATION_EVENT_KEY.VERIFICATION_SLA_BREACH]: true,
    [ADMIN_NOTIFICATION_EVENT_KEY.FLAGGED_ACTIVITY]: true,
    [ADMIN_NOTIFICATION_EVENT_KEY.WEEKLY_SUMMARY_EMAIL]: false,
  }
