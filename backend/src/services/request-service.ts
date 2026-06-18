import mongoose from 'mongoose'
import {
  LISTING_STATUS,
  REQUEST_STATUS,
  ROLES,
  VERIFICATION_STATUS,
} from '../constants/enums.js'
import {
  REQUEST_ERROR_CODES,
  REQUEST_MESSAGES,
} from '../constants/request.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { Donor } from '../models/user.js'
import { conflict } from '../utils/app-error.js'
import {
  isListingExpiredByTime,
  resolveEffectiveListingStatus,
} from '../utils/resolve-effective-listing-status.js'
import {
  serializeRequest,
  type SerializedRequest,
} from '../utils/serialize-request.js'

const ACTIVE_REQUEST_STATUSES = [
  REQUEST_STATUS.REQUESTED,
  REQUEST_STATUS.ACCEPTED,
] as const

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === 11000
  )
}

async function assertListingAvailableForRequest(listingId: string) {
  if (!mongoose.isValidObjectId(listingId)) {
    throw conflict(
      REQUEST_MESSAGES.LISTING_NOT_AVAILABLE,
      REQUEST_ERROR_CODES.LISTING_NOT_AVAILABLE,
    )
  }

  const listing = await Listing.findById(listingId).lean()
  if (!listing) {
    throw conflict(
      REQUEST_MESSAGES.LISTING_NOT_AVAILABLE,
      REQUEST_ERROR_CODES.LISTING_NOT_AVAILABLE,
    )
  }

  const donor = await Donor.findOne({
    _id: listing.donor,
    role: ROLES.DONOR,
    'verification.status': VERIFICATION_STATUS.APPROVED,
  })
    .select('_id')
    .lean()

  if (!donor) {
    throw conflict(
      REQUEST_MESSAGES.LISTING_NOT_AVAILABLE,
      REQUEST_ERROR_CODES.LISTING_NOT_AVAILABLE,
    )
  }

  const now = new Date()
  const effectiveStatus = resolveEffectiveListingStatus(
    listing.status,
    listing.expiresAt,
    now,
  )

  if (
    effectiveStatus === LISTING_STATUS.EXPIRED ||
    isListingExpiredByTime(listing.expiresAt, now)
  ) {
    throw conflict(
      REQUEST_MESSAGES.LISTING_NOT_AVAILABLE,
      REQUEST_ERROR_CODES.LISTING_NOT_AVAILABLE,
    )
  }

  if (effectiveStatus !== LISTING_STATUS.ACTIVE) {
    throw conflict(
      REQUEST_MESSAGES.LISTING_NOT_ACCEPTING,
      REQUEST_ERROR_CODES.LISTING_NOT_ACCEPTING,
    )
  }

  return listing
}

export async function createRequestForNgo(input: {
  ngoId: string
  listingId: string
}): Promise<SerializedRequest> {
  await assertListingAvailableForRequest(input.listingId)

  const existingActiveRequest = await FoodRequest.findOne({
    listing: input.listingId,
    ngo: input.ngoId,
    status: { $in: ACTIVE_REQUEST_STATUSES },
  }).lean()

  if (existingActiveRequest) {
    throw conflict(
      REQUEST_MESSAGES.ALREADY_REQUESTED,
      REQUEST_ERROR_CODES.REQUEST_ALREADY_EXISTS,
    )
  }

  try {
    const request = await FoodRequest.create({
      listing: input.listingId,
      ngo: input.ngoId,
      status: REQUEST_STATUS.REQUESTED,
    })

    // TODO: notification slice — notify donor that an NGO requested their listing

    return serializeRequest(
      request.toObject() as Parameters<typeof serializeRequest>[0],
    )
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw conflict(
        REQUEST_MESSAGES.ALREADY_REQUESTED,
        REQUEST_ERROR_CODES.REQUEST_ALREADY_EXISTS,
      )
    }

    throw error
  }
}

export async function ngoHasActiveRequestForListing(input: {
  ngoId: string
  listingId: string
}): Promise<boolean> {
  const count = await FoodRequest.countDocuments({
    listing: input.listingId,
    ngo: input.ngoId,
    status: { $in: ACTIVE_REQUEST_STATUSES },
  })

  return count > 0
}
