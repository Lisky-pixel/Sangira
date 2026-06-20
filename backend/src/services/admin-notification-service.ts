import { ROLES, NOTIFICATION_TYPE, ACCOUNT_STATUS } from '../constants/enums.js'
import {
  ADMIN_NOTIFICATION_TITLE,
  formatAdminVerificationSubmittedBody,
} from '../constants/admin-notifications.js'
import { ADMIN_NOTIFICATION_EVENT_KEY } from '../constants/admin-notification-preferences.js'
import { MONGO_READ_PREFERENCE_PRIMARY } from '../constants/mongo.js'
import { Admin } from '../models/user.js'
import { normalizeNotificationPrefs } from '../utils/normalize-notification-prefs.js'
import { createInAppNotificationForUser } from './admin-verification-notifications.js'

export async function notifyAdminsOfNewVerification(input: {
  organisationName: string
  role: typeof ROLES.DONOR | typeof ROLES.NGO
}) {
  const admins = await Admin.find({ accountStatus: ACCOUNT_STATUS.ACTIVE })
    .select('notificationPrefs')
    .lean<{ _id: { toString(): string }; notificationPrefs?: unknown }[]>()
    .read(MONGO_READ_PREFERENCE_PRIMARY)

  const roleLabel = input.role === ROLES.DONOR ? 'Donor' : 'NGO'

  await Promise.all(
    admins.map(async (admin) => {
      const prefs = normalizeNotificationPrefs(
        admin.notificationPrefs as Parameters<
          typeof normalizeNotificationPrefs
        >[0],
      )
      if (
        !prefs.adminEvents?.[
          ADMIN_NOTIFICATION_EVENT_KEY.NEW_VERIFICATION_SUBMITTED
        ]
      ) {
        return
      }

      await createInAppNotificationForUser({
        userId: admin._id.toString(),
        type: NOTIFICATION_TYPE.VERIFICATION_SUBMITTED,
        title:
          ADMIN_NOTIFICATION_TITLE[NOTIFICATION_TYPE.VERIFICATION_SUBMITTED],
        body: formatAdminVerificationSubmittedBody({
          organisationName: input.organisationName,
          roleLabel,
        }),
      })
    }),
  )
}
