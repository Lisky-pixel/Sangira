import mongoose from 'mongoose'
import { VERIFICATION_STATUS } from '../constants/enums.js'
import { MONGO_READ_PREFERENCE_PRIMARY } from '../constants/mongo.js'
import { Admin, User } from '../models/user.js'
import { conflict, notFound } from '../utils/app-error.js'
import { normalizePhone } from '../utils/phone.js'
import type { UpdateAdminProfileInput } from '../validators/admin-me.js'

export type SerializedAdminProfile = {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
  passwordChangedAt?: string
}

export type SerializedAdminReviewerActivity = {
  verificationsReviewed: number
  approved: number
  rejected: number
}

export type AdminMeData = {
  profile: SerializedAdminProfile
  activity: SerializedAdminReviewerActivity
}

function serializeAdminProfile(
  admin: {
    _id: mongoose.Types.ObjectId
    name?: string
    email: string
    phone?: string
    createdAt: Date
    passwordChangedAt?: Date
  },
): SerializedAdminProfile {
  return {
    id: admin._id.toString(),
    name: admin.name?.trim() || 'Administrator',
    email: admin.email,
    ...(admin.phone ? { phone: admin.phone } : {}),
    createdAt: admin.createdAt.toISOString(),
    ...(admin.passwordChangedAt
      ? { passwordChangedAt: admin.passwordChangedAt.toISOString() }
      : {}),
  }
}

export async function getAdminReviewerActivity(
  adminId: string,
): Promise<SerializedAdminReviewerActivity> {
  const reviewerId = new mongoose.Types.ObjectId(adminId)

  const [approved, rejected] = await Promise.all([
    User.countDocuments({
      'verification.reviewedBy': reviewerId,
      'verification.status': VERIFICATION_STATUS.APPROVED,
    }).read(MONGO_READ_PREFERENCE_PRIMARY),
    User.countDocuments({
      'verification.reviewedBy': reviewerId,
      'verification.status': VERIFICATION_STATUS.REJECTED,
    }).read(MONGO_READ_PREFERENCE_PRIMARY),
  ])

  return {
    verificationsReviewed: approved + rejected,
    approved,
    rejected,
  }
}

export async function getAdminMe(adminId: string): Promise<AdminMeData> {
  const admin = await Admin.findById(adminId)
    .select('name email phone createdAt passwordChangedAt')
    .lean<{
      _id: mongoose.Types.ObjectId
      name?: string
      email: string
      phone?: string
      createdAt: Date
      passwordChangedAt?: Date
    }>()
    .read(MONGO_READ_PREFERENCE_PRIMARY)

  if (!admin) {
    throw notFound('Admin not found', 'ADMIN_NOT_FOUND')
  }

  const activity = await getAdminReviewerActivity(adminId)

  return {
    profile: serializeAdminProfile(admin),
    activity,
  }
}

export async function updateAdminProfile(
  adminId: string,
  input: UpdateAdminProfileInput,
): Promise<SerializedAdminProfile> {
  const admin = await Admin.findById(adminId)

  if (!admin) {
    throw notFound('Admin not found', 'ADMIN_NOT_FOUND')
  }

  if (input.name !== undefined) {
    admin.set('name', input.name.trim())
  }

  if (input.phone !== undefined) {
    if (input.phone === null || input.phone.trim() === '') {
      admin.set('phone', undefined)
    } else {
      const normalized = normalizePhone(input.phone)
      if (!normalized) {
        throw conflict('Invalid phone number', 'INVALID_PHONE')
      }

      const existing = await User.findOne({
        phone: normalized,
        _id: { $ne: admin._id },
      })
        .select('_id')
        .lean()

      if (existing) {
        throw conflict('Phone number already in use', 'PHONE_EXISTS')
      }

      admin.set('phone', normalized)
    }
  }

  await admin.save()

  return serializeAdminProfile({
    _id: admin._id,
    name: admin.get('name') as string | undefined,
    email: admin.email,
    phone: admin.get('phone') as string | undefined,
    createdAt: admin.createdAt,
    passwordChangedAt: admin.passwordChangedAt,
  })
}
