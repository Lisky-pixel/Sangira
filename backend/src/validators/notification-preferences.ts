import { z } from 'zod'
import {
  NOTIFICATION_CHANNEL_KEY,
  NOTIFICATION_EVENT_KEY,
} from '../constants/notification-preferences.js'
import { ADMIN_NOTIFICATION_EVENT_KEY } from '../constants/admin-notification-preferences.js'
import { NGO_NOTIFICATION_EVENT_KEY } from '../constants/ngo-notification-preferences.js'

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

const ngoNotificationEventPatchSchema = z
  .object({
    [NGO_NOTIFICATION_EVENT_KEY.NEW_LISTING_AVAILABLE]: z.boolean().optional(),
    [NGO_NOTIFICATION_EVENT_KEY.REQUEST_ACCEPTED]: z.boolean().optional(),
    [NGO_NOTIFICATION_EVENT_KEY.PICKUP_REMINDERS]: z.boolean().optional(),
    [NGO_NOTIFICATION_EVENT_KEY.CAPACITY_REMINDER]: z.boolean().optional(),
  })
  .strict()

const adminNotificationEventPatchSchema = z
  .object({
    [ADMIN_NOTIFICATION_EVENT_KEY.NEW_VERIFICATION_SUBMITTED]: z
      .boolean()
      .optional(),
    [ADMIN_NOTIFICATION_EVENT_KEY.VERIFICATION_SLA_BREACH]: z
      .boolean()
      .optional(),
    [ADMIN_NOTIFICATION_EVENT_KEY.FLAGGED_ACTIVITY]: z.boolean().optional(),
    [ADMIN_NOTIFICATION_EVENT_KEY.WEEKLY_SUMMARY_EMAIL]: z
      .boolean()
      .optional(),
  })
  .strict()

export const updateNotificationPreferencesSchema = z
  .object({
    channels: notificationChannelPatchSchema.optional(),
    events: notificationEventPatchSchema.optional(),
    ngoEvents: ngoNotificationEventPatchSchema.optional(),
    adminEvents: adminNotificationEventPatchSchema.optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.channels !== undefined ||
      value.events !== undefined ||
      value.ngoEvents !== undefined ||
      value.adminEvents !== undefined,
    { message: 'At least one preference must be provided' },
  )

export type UpdateNotificationPreferencesInput = z.infer<
  typeof updateNotificationPreferencesSchema
>
