import { Notification } from '../models/notification.js'
import { NOTIFICATION_TYPE, type NotificationType } from '../constants/enums.js'
import { emitNotificationNew } from '../realtime/notification-events.js'

type CreateVerificationNotificationInput = {
  userId: string
  type:
    | typeof NOTIFICATION_TYPE.VERIFICATION_APPROVED
    | typeof NOTIFICATION_TYPE.VERIFICATION_REJECTED
  title: string
  body: string
}

export async function createInAppNotificationForUser(
  input: CreateVerificationNotificationInput,
) {
  const doc = await Notification.create({
    user: input.userId,
    type: input.type as NotificationType,
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
