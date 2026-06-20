import {
  normalizeNotificationPrefs,
  type NotificationPreferences,
} from '../utils/normalize-notification-prefs.js'
import { getVerificationSlaTargetHours } from './platform-settings-service.js'
import { Admin } from '../models/user.js'
import { notFound } from '../utils/app-error.js'

export type AdminSettingsData = {
  adminNotificationPrefs: NonNullable<NotificationPreferences['adminEvents']>
  verificationSlaTargetHours: number
}

export async function getAdminSettings(
  adminId: string,
): Promise<AdminSettingsData> {
  const admin = await Admin.findById(adminId).select('notificationPrefs').lean()

  if (!admin) {
    throw notFound('Admin not found', 'ADMIN_NOT_FOUND')
  }

  const prefs = normalizeNotificationPrefs(admin.notificationPrefs)
  const verificationSlaTargetHours = await getVerificationSlaTargetHours()

  return {
    adminNotificationPrefs: prefs.adminEvents!,
    verificationSlaTargetHours,
  }
}
