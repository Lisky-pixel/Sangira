import bcrypt from 'bcryptjs'
import mongoose, { type HydratedDocument, type Model, Schema } from 'mongoose'
import { config } from '../config/env.js'
import {
  ACCOUNT_STATUS,
  NGO_SECTOR,
  ROLES,
  VERIFICATION_STATUS,
  type Role,
} from '../constants/enums.js'
import { listingPickupLocationSchema } from './schemas/listing-pickup-location.js'
import { adminAuditEntrySchema } from './schemas/admin-audit-entry.js'
import { geoPointSchema, verificationSchema } from './schemas/geo-point.js'
import { TRANSPORT_MODE_VALUES } from '../constants/transport-mode.js'
import { normalizePhone } from '../utils/phone.js'

import {
  DEFAULT_NOTIFICATION_CHANNEL_PREFS,
  DEFAULT_NOTIFICATION_EVENT_PREFS,
  type NotificationPreferences,
} from '../constants/notification-preferences.js'
import { DEFAULT_ADMIN_NOTIFICATION_EVENT_PREFS } from '../constants/admin-notification-preferences.js'

export type IUser = {
  email: string
  passwordHash: string
  role: Role
  phone?: string
  accountStatus: string
  notificationPrefs: NotificationPreferences
  avatarUrl?: string
  passwordChangedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type IUserMethods = {
  comparePassword(plain: string): Promise<boolean>
}

export type UserModel = Model<IUser, object, IUserMethods>

const emailValidator = {
  validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message: 'Invalid email address',
}

function stripSensitiveFields<T extends Record<string, unknown>>(ret: T) {
  const { passwordHash: _passwordHash, __v: _version, ...sanitized } = ret
  void _passwordHash
  void _version
  return sanitized
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: emailValidator,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(ROLES),
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      required(this: { role?: string }) {
        return this.role !== ROLES.ADMIN
      },
      set: (value: string) => normalizePhone(value) ?? value,
      validate: {
        validator: (value: string) => normalizePhone(value) !== null,
        message: 'Invalid phone number',
      },
    },
    accountStatus: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
    },
    notificationPrefs: {
      channels: {
        email: {
          type: Boolean,
          default: DEFAULT_NOTIFICATION_CHANNEL_PREFS.email,
        },
        inApp: {
          type: Boolean,
          default: DEFAULT_NOTIFICATION_CHANNEL_PREFS.inApp,
        },
        sms: {
          type: Boolean,
          default: DEFAULT_NOTIFICATION_CHANNEL_PREFS.sms,
        },
      },
      events: {
        newRequest: {
          type: Boolean,
          default: DEFAULT_NOTIFICATION_EVENT_PREFS.newRequest,
        },
        pickupReminders: {
          type: Boolean,
          default: DEFAULT_NOTIFICATION_EVENT_PREFS.pickupReminders,
        },
        listingExpiring: {
          type: Boolean,
          default: DEFAULT_NOTIFICATION_EVENT_PREFS.listingExpiring,
        },
        impactSummary: {
          type: Boolean,
          default: DEFAULT_NOTIFICATION_EVENT_PREFS.impactSummary,
        },
      },
      adminEvents: {
        newVerificationSubmitted: {
          type: Boolean,
          default:
            DEFAULT_ADMIN_NOTIFICATION_EVENT_PREFS.newVerificationSubmitted,
        },
        verificationSlaBreach: {
          type: Boolean,
          default:
            DEFAULT_ADMIN_NOTIFICATION_EVENT_PREFS.verificationSlaBreach,
        },
        flaggedActivity: {
          type: Boolean,
          default: DEFAULT_ADMIN_NOTIFICATION_EVENT_PREFS.flaggedActivity,
        },
        weeklySummaryEmail: {
          type: Boolean,
          default: DEFAULT_ADMIN_NOTIFICATION_EVENT_PREFS.weeklySummaryEmail,
        },
      },
    },
    avatarUrl: { type: String, trim: true },
    passwordChangedAt: { type: Date },
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
    toJSON: {
      transform(_doc, ret) {
        return stripSensitiveFields(ret as Record<string, unknown>)
      },
    },
    toObject: {
      transform(_doc, ret) {
        return stripSensitiveFields(ret as Record<string, unknown>)
      },
    },
  },
)

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('passwordHash')) return

  const plain = this.passwordHash
  if (plain.startsWith('$2a$') || plain.startsWith('$2b$')) return

  this.passwordHash = await bcrypt.hash(plain, config.BCRYPT_SALT_ROUNDS)
})

userSchema.methods.comparePassword = async function comparePassword(
  plain: string,
) {
  const user = await User.findById(this._id).select('+passwordHash')
  if (!user?.passwordHash) return false
  return bcrypt.compare(plain, user.passwordHash)
}

userSchema.index({ role: 1 })
userSchema.index({ 'verification.status': 1 })

export const User = mongoose.model<IUser, UserModel>('User', userSchema)

const donorSchema = new Schema({
  organisationName: { type: String, required: true, trim: true },
  contactName: { type: String, required: true, trim: true },
  businessCertificateUrl: { type: String, trim: true },
  /** Set during verification — read-only in donor profile */
  businessRegistrationNumber: { type: String, trim: true },
  pickupAddress: { type: String, trim: true },
  pickupLocation: { type: listingPickupLocationSchema, required: false },
  verification: {
    type: verificationSchema,
    default: () => ({ status: VERIFICATION_STATUS.PENDING }),
  },
  adminAuditTrail: {
    type: [adminAuditEntrySchema],
    default: [],
  },
})

const ngoTransportSchema = new Schema(
  {
    hasOwnTransport: { type: Boolean, default: false },
    mode: { type: String, enum: TRANSPORT_MODE_VALUES },
  },
  { _id: false },
)

const ngoPickupHoursSchema = new Schema(
  {
    from: { type: String, trim: true },
    to: { type: String, trim: true },
  },
  { _id: false },
)

const ngoSchema = new Schema({
  organisationName: { type: String, required: true, trim: true },
  contactName: { type: String, required: true, trim: true },
  registrationNumber: { type: String, trim: true },
  dailyCapacity: { type: Number, min: 0 },
  transportAvailable: { type: Boolean, default: false },
  transport: {
    type: ngoTransportSchema,
    default: () => ({ hasOwnTransport: false }),
  },
  pickupHours: { type: ngoPickupHoursSchema },
  paused: { type: Boolean, default: false },
  sector: {
    type: String,
    enum: Object.values(NGO_SECTOR),
  },
  serviceLocation: { type: geoPointSchema },
  verification: {
    type: verificationSchema,
    default: () => ({ status: VERIFICATION_STATUS.PENDING }),
  },
  adminAuditTrail: {
    type: [adminAuditEntrySchema],
    default: [],
  },
})

const adminSchema = new Schema({
  name: { type: String, required: true, trim: true },
})

export const Donor = User.discriminator(ROLES.DONOR, donorSchema)
export const Ngo = User.discriminator(ROLES.NGO, ngoSchema)
export const Admin = User.discriminator(ROLES.ADMIN, adminSchema)

export type UserDocument = HydratedDocument<IUser, IUserMethods>
