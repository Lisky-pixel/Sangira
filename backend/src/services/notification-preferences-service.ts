import {
  mergeNotificationPrefs,
  normalizeNotificationPrefs,
} from '../utils/normalize-notification-prefs.js'
import type { NotificationPreferences } from '../constants/notification-preferences.js'
import { notFound } from '../utils/app-error.js'
import { User } from '../models/user.js'
import type { UpdateNotificationPreferencesInput } from '../validators/notification-preferences.js'

export async function updateNotificationPreferencesForUser(input: {
  userId: string
  patch: UpdateNotificationPreferencesInput
}): Promise<NotificationPreferences> {
  const user = await User.findById(input.userId)

  if (!user) {
    throw notFound('User not found', 'USER_NOT_FOUND')
  }

  const current = normalizeNotificationPrefs(user.notificationPrefs)
  const next = mergeNotificationPrefs(current, input.patch)

  user.notificationPrefs = next
  await user.save()

  return normalizeNotificationPrefs(user.notificationPrefs)
}
