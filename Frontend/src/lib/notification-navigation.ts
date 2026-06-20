import { resolveDonorNotificationHref } from './donor-notification-navigation'
import { resolveNgoNotificationHref } from './ngo-notification-navigation'
import type { AppNotification } from '../types/notification'

export function resolveNotificationHref(
  notification: AppNotification,
  role: string,
): string | null {
  if (role === 'ngo') {
    return resolveNgoNotificationHref(notification)
  }

  if (role === 'donor') {
    return resolveDonorNotificationHref(notification)
  }

  return null
}
