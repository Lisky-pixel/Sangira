import { uploadAvatarPhoto } from '../config/cloudinary.js'
import { AVATAR_UPLOAD_ROLES } from '../constants/avatar-photo.js'
import { ROLES } from '../constants/enums.js'
import {
  PROFILE_PHONE_TAKEN_CODE,
  PROFILE_PHONE_TAKEN_MESSAGE,
} from '../constants/profile.js'
import { Donor, Ngo, User } from '../models/user.js'
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

export type ProfileUpdateResult = {
  user: ReturnType<typeof serializeUser>
  geocodeResolved?: boolean
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

async function getNgoOrThrow(userId: string) {
  const user = await Ngo.findById(userId)

  if (!user) {
    const baseUser = await User.findById(userId)
    if (!baseUser) {
      throw notFound('User not found', 'USER_NOT_FOUND')
    }
    throw forbidden('Only NGOs can update this profile', 'PROFILE_FORBIDDEN')
  }

  return user
}

export async function updateProfileForDonor(input: {
  userId: string
  patch: PatchProfileInput
}): Promise<ProfileUpdateResult> {
  const user = await getDonorOrThrow(input.userId)
  let geocodeResolved: boolean | undefined

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
    geocodeResolved = geocoded !== null
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

  return {
    user: serializeUser(user),
    ...(geocodeResolved !== undefined ? { geocodeResolved } : {}),
  }
}

export async function updateProfileForNgo(input: {
  userId: string
  patch: PatchProfileInput
}): Promise<ProfileUpdateResult> {
  const user = await getNgoOrThrow(input.userId)
  let geocodeResolved: boolean | undefined

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
    const geocoded = await geocodeAddress(address)
    geocodeResolved = geocoded !== null
    if (geocoded) {
      user.serviceLocation = {
        type: 'Point',
        coordinates: [geocoded.lng, geocoded.lat],
        address,
      }
    } else {
      const existingCoords = user.serviceLocation?.coordinates
      if (existingCoords && existingCoords.length === 2) {
        user.serviceLocation = {
          type: 'Point',
          coordinates: existingCoords,
          address,
        }
      } else {
        user.serviceLocation = { address }
      }
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

  return {
    user: serializeUser(user),
    ...(geocodeResolved !== undefined ? { geocodeResolved } : {}),
  }
}

export async function updateProfileForUser(input: {
  userId: string
  role: string
  patch: PatchProfileInput
}): Promise<ProfileUpdateResult> {
  if (input.role === ROLES.DONOR) {
    return updateProfileForDonor({ userId: input.userId, patch: input.patch })
  }

  if (input.role === ROLES.NGO) {
    return updateProfileForNgo({ userId: input.userId, patch: input.patch })
  }

  throw forbidden('This account cannot update this profile', 'PROFILE_FORBIDDEN')
}

export async function updateAvatarForUser(input: {
  userId: string
  photo: AvatarFile
}) {
  const user = await User.findById(input.userId)

  if (!user) {
    throw notFound('User not found', 'USER_NOT_FOUND')
  }

  if (
    !(AVATAR_UPLOAD_ROLES as readonly string[]).includes(user.role ?? '')
  ) {
    throw forbidden('This account cannot update an avatar', 'PROFILE_FORBIDDEN')
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
