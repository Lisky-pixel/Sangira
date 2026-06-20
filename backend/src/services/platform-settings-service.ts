import {
  PLATFORM_SETTINGS_KEY,
  VERIFICATION_SLA_TARGET_HOURS,
} from '../constants/platform-settings.js'
import { MONGO_READ_PREFERENCE_PRIMARY } from '../constants/mongo.js'
import { PlatformSettings } from '../models/platform-settings.js'

export async function getVerificationSlaTargetHours(): Promise<number> {
  const doc = await PlatformSettings.findOne({
    key: PLATFORM_SETTINGS_KEY.GLOBAL,
  })
    .select('verificationSlaTargetHours')
    .lean<{ verificationSlaTargetHours?: number }>()
    .read(MONGO_READ_PREFERENCE_PRIMARY)

  const hours = doc?.verificationSlaTargetHours
  if (typeof hours === 'number' && Number.isFinite(hours)) {
    return hours
  }

  return VERIFICATION_SLA_TARGET_HOURS.DEFAULT
}

export async function updateVerificationSlaTargetHours(
  hours: number,
): Promise<number> {
  const doc = await PlatformSettings.findOneAndUpdate(
    { key: PLATFORM_SETTINGS_KEY.GLOBAL },
    {
      $set: { verificationSlaTargetHours: hours },
      $setOnInsert: { key: PLATFORM_SETTINGS_KEY.GLOBAL },
    },
    { upsert: true, new: true, readPreference: MONGO_READ_PREFERENCE_PRIMARY },
  )
    .select('verificationSlaTargetHours')
    .lean<{ verificationSlaTargetHours: number }>()

  return doc.verificationSlaTargetHours
}
