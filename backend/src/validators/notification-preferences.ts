import { z } from 'zod'
import { NOTIFICATION_PREF_KEY } from '../constants/notification-preferences.js'

export const updateNotificationPreferencesSchema = z
  .object({
    [NOTIFICATION_PREF_KEY.NEW_REQUEST]: z.boolean().optional(),
    [NOTIFICATION_PREF_KEY.PICKUP_REMINDERS]: z.boolean().optional(),
    [NOTIFICATION_PREF_KEY.LISTING_EXPIRING]: z.boolean().optional(),
    [NOTIFICATION_PREF_KEY.IMPACT_SUMMARY]: z.boolean().optional(),
  })
  .refine(
    (value) =>
      Object.values(value).some((entry) => typeof entry === 'boolean'),
    { message: 'At least one preference must be provided' },
  )

export type UpdateNotificationPreferencesInput = z.infer<
  typeof updateNotificationPreferencesSchema
>
