import {
  NOTIFICATION_SOCKET,
  USER_ROOM_PREFIX,
} from '../constants/notifications.js'
import { getSocketServer } from './handover-events.js'

export type NotificationNewPayload = {
  notification: {
    id: string
    type: string
    title: string
    body: string
    read: boolean
    createdAt: string
    relatedListing?: string
    relatedRequest?: string
  }
  unreadCount: number
}

export function userRoomName(userId: string): string {
  return `${USER_ROOM_PREFIX}${userId}`
}

export function emitNotificationNew(
  userId: string,
  payload: NotificationNewPayload,
): void {
  getSocketServer()
    ?.to(userRoomName(userId))
    .emit(NOTIFICATION_SOCKET.EVENT_NEW, payload)
}
