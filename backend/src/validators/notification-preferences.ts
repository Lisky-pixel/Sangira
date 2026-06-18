import { z } from 'zod'
import {
  NOTIFICATION_CHANNEL_KEY,
  NOTIFICATION_EVENT_KEY,
} from '../constants/notification-preferences.js'

const notificationChannelPatchSchema = z
  .object({
    [NOTIFICATION_CHANNEL_KEY.EMAIL]: z.boolean().optional(),
    [NOTIFICATION_CHANNEL_KEY.IN_APP]: z.boolean().optional(),
    [NOTIFICATION_CHANNEL_KEY.SMS]: z.boolean().optional(),
  })
  .strict()

const notificationEventPatchSchema = z
  .object({
    [NOTIFICATION_EVENT_KEY.NEW_REQUEST]: z.boolean().optional(),
    [NOTIFICATION_EVENT_KEY.PICKUP_REMINDERS]: z.boolean().optional(),
    [NOTIFICATION_EVENT_KEY.LISTING_EXPIRING]: z.boolean().optional(),
    [NOTIFICATION_EVENT_KEY.IMPACT_SUMMARY]: z.boolean().optional(),
  })
  .strict()

export const updateNotificationPreferencesSchema = z
  .object({
    channels: notificationChannelPatchSchema.optional(),
    events: notificationEventPatchSchema.optional(),
  })
  .strict()
  .refine(
    (value) => value.channels !== undefined || value.events !== undefined,
    { message: 'At least one preference must be provided' },
  )

export type UpdateNotificationPreferencesInput = z.infer<
  typeof updateNotificationPreferencesSchema
>
