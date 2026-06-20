import { Notification } from '../models/notification.js'
import { type NotificationType } from '../constants/enums.js'
import { emitNotificationNew } from '../realtime/notification-events.js'

type CreateInAppNotificationInput = {
  userId: string
  type: NotificationType
  title: string
  body: string
}

export async function createInAppNotificationForUser(
  input: CreateInAppNotificationInput,
) {
  const doc = await Notification.create({
    user: input.userId,
    type: input.type,
    title: input.title,
    body: input.body,
    read: false,
    sentVia: { inApp: true, sms: false },
  })

  const unreadCount = await Notification.countDocuments({
    user: input.userId,
    read: false,
  })

  emitNotificationNew(input.userId, {
    notification: {
      id: doc._id.toString(),
      type: doc.type,
      title: doc.title,
      body: doc.body,
      read: doc.read,
      createdAt: doc.createdAt.toISOString(),
    },
    unreadCount,
  })
}
