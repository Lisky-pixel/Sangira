import mongoose, { Schema } from 'mongoose'
import {
  PLATFORM_SETTINGS_KEY,
  VERIFICATION_SLA_TARGET_HOURS,
} from '../constants/platform-settings.js'

const platformSettingsSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(PLATFORM_SETTINGS_KEY),
    },
    verificationSlaTargetHours: {
      type: Number,
      required: true,
      min: VERIFICATION_SLA_TARGET_HOURS.MIN,
      max: VERIFICATION_SLA_TARGET_HOURS.MAX,
      default: VERIFICATION_SLA_TARGET_HOURS.DEFAULT,
    },
  },
  { timestamps: true },
)

export const PlatformSettings = mongoose.model(
  'PlatformSettings',
  platformSettingsSchema,
)
