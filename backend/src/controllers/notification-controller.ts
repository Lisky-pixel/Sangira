import type { Request, Response, NextFunction } from 'express'
import {
  listNotificationsForUser,
  markAllNotificationsReadForUser,
  markNotificationReadForUser,
} from '../services/notification-service.js'
import type {
  ListNotificationsQuery,
  NotificationIdParam,
} from '../validators/notifications.js'
import { sendSuccess } from '../utils/response.js'

export async function listNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = req.validatedQuery as ListNotificationsQuery
    const result = await listNotificationsForUser({
      userId: req.auth!.userId,
      limit: query.limit,
    })

    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function markAllNotificationsRead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await markAllNotificationsReadForUser(req.auth!.userId)
    return sendSuccess(res, result)
  } catch (error) {
    return next(error)
  }
}

export async function markNotificationRead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.validatedParams as NotificationIdParam
    const result = await markNotificationReadForUser({
      userId: req.auth!.userId,
      notificationId: params.id,
    })

    return sendSuccess(res, {
      notification: result.notification,
      unreadCount: result.unreadCount,
    })
  } catch (error) {
    return next(error)
  }
}
