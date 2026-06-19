import { z } from 'zod'
import { NOTIFICATION_LIST } from '../constants/notifications.js'

export const listNotificationsQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(NOTIFICATION_LIST.MAX_LIMIT)
    .default(NOTIFICATION_LIST.DROPDOWN_LIMIT),
})

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>

export const notificationIdParamSchema = z.object({
  id: z.string().min(1),
})

export type NotificationIdParam = z.infer<typeof notificationIdParamSchema>
