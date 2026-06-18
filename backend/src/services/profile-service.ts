import { uploadAvatarPhoto } from '../config/cloudinary.js'
import { ROLES } from '../constants/enums.js'
import {
  PROFILE_PHONE_TAKEN_CODE,
  PROFILE_PHONE_TAKEN_MESSAGE,
} from '../constants/profile.js'
import { Donor, User } from '../models/user.js'
import { geocodeAddress } from './geocoding/geocode-address.js'
import type { PatchProfileInput } from '../validators/profile.js'
import {
  badRequest,
  conflict,
  forbidden,
  notFound,
} from '../utils/app-error.js'
import { normalizePhone } from '../utils/phone.js'
import { serializeUser } from '../utils/user-serializer.js'

type AvatarFile = {
  buffer: Buffer
  originalname: string
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === 11000
  )
}

async function getDonorOrThrow(userId: string) {
  const user = await Donor.findById(userId)

  if (!user) {
    const baseUser = await User.findById(userId)
    if (!baseUser) {
      throw notFound('User not found', 'USER_NOT_FOUND')
    }
    throw forbidden('Only donors can update this profile', 'PROFILE_FORBIDDEN')
  }

  return user
}

export async function updateProfileForDonor(input: {
  userId: string
  patch: PatchProfileInput
}) {
  const user = await getDonorOrThrow(input.userId)

  if (input.patch.organisationName !== undefined) {
    user.organisationName = input.patch.organisationName
  }

  if (input.patch.contactName !== undefined) {
    user.contactName = input.patch.contactName
  }

  if (input.patch.phone !== undefined) {
    const normalizedPhone = normalizePhone(input.patch.phone)
    if (!normalizedPhone) {
      throw badRequest(
        'Enter a valid Rwanda mobile number',
        'INVALID_PHONE',
      )
    }

    const phoneOwner = await User.findOne({ phone: normalizedPhone }).select('_id')
    if (phoneOwner && phoneOwner._id.toString() !== user._id.toString()) {
      throw conflict(PROFILE_PHONE_TAKEN_MESSAGE, PROFILE_PHONE_TAKEN_CODE)
    }

    user.phone = normalizedPhone
  }

  if (input.patch.address !== undefined) {
    const address = input.patch.address
    user.pickupAddress = address

    const geocoded = await geocodeAddress(address)
    if (geocoded) {
      user.pickupLocation = {
        type: 'Point',
        coordinates: [geocoded.lng, geocoded.lat],
        address,
      }
    } else {
      user.pickupLocation = { address }
    }
  }

  try {
    await user.save()
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw conflict(PROFILE_PHONE_TAKEN_MESSAGE, PROFILE_PHONE_TAKEN_CODE)
    }
    throw error
  }

  return serializeUser(user)
}

export async function updateAvatarForUser(input: {
  userId: string
  photo: AvatarFile
}) {
  const user = await User.findById(input.userId)

  if (!user) {
    throw notFound('User not found', 'USER_NOT_FOUND')
  }

  if (user.role !== ROLES.DONOR) {
    throw forbidden('Only donors can update this avatar', 'PROFILE_FORBIDDEN')
  }

  const upload = await uploadAvatarPhoto(
    input.photo.buffer,
    input.photo.originalname,
  ).catch(() => {
    throw badRequest('Failed to upload avatar photo', 'AVATAR_UPLOAD_FAILED')
  })

  user.avatarUrl = upload.secureUrl
  await user.save()

  return serializeUser(user)
}
