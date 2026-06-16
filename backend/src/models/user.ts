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
import { geoPointSchema, verificationSchema } from './schemas/geo-point.js'
import { normalizePhone } from '../utils/phone.js'

export type NotificationPrefs = {
  sms: boolean
  inApp: boolean
}

export type IUser = {
  email: string
  passwordHash: string
  role: Role
  phone?: string
  accountStatus: string
  notificationPrefs: NotificationPrefs
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
      sms: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
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
  pickupLocation: { type: geoPointSchema },
  verification: {
    type: verificationSchema,
    default: () => ({ status: VERIFICATION_STATUS.PENDING }),
  },
})

const ngoSchema = new Schema({
  organisationName: { type: String, required: true, trim: true },
  contactName: { type: String, required: true, trim: true },
  registrationNumber: { type: String, trim: true },
  dailyCapacity: { type: Number, min: 0 },
  transportAvailable: { type: Boolean, default: false },
  sector: {
    type: String,
    enum: Object.values(NGO_SECTOR),
  },
  serviceLocation: { type: geoPointSchema },
  verification: {
    type: verificationSchema,
    default: () => ({ status: VERIFICATION_STATUS.PENDING }),
  },
})

const adminSchema = new Schema({
  name: { type: String, required: true, trim: true },
})

export const Donor = User.discriminator(ROLES.DONOR, donorSchema)
export const Ngo = User.discriminator(ROLES.NGO, ngoSchema)
export const Admin = User.discriminator(ROLES.ADMIN, adminSchema)

export type UserDocument = HydratedDocument<IUser, IUserMethods>
