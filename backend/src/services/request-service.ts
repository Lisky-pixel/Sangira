import mongoose from 'mongoose'
import { MongoServerError } from 'mongodb'
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
import { Donor, User } from '../models/user.js'
import {
  maybeNotifyDonorRequestReceived,
  notifyDonorRequestAccepted,
} from './notification-service.js'
import {
  AppError,
  conflict,
  forbidden,
  notFound,
} from '../utils/app-error.js'
import {
  generateHandoverQrToken,
  generatePickupPin,
  hashPickupPin,
} from '../utils/handover-credentials.js'
import {
  isListingExpiredByTime,
  resolveEffectiveListingStatus,
} from '../utils/resolve-effective-listing-status.js'
import {
  countNgoMyRequestsByTab,
  serializeNgoMyRequest,
  type SerializedNgoMyRequestsResult,
} from '../utils/serialize-ngo-my-request.js'
import {
  serializeAcceptedRequest,
  serializeDonorListingRequest,
  serializeRequest,
  type SerializedAcceptedRequest,
  type SerializedDonorListingRequest,
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

    const [listing, ngo] = await Promise.all([
      Listing.findById(input.listingId).select('donor title').lean(),
      User.findById(input.ngoId).select('organisationName').lean() as Promise<{
        organisationName?: string | null
      } | null>,
    ])

    if (listing) {
      await maybeNotifyDonorRequestReceived({
        donorId: listing.donor.toString(),
        requestId: request._id.toString(),
        listingId: input.listingId,
        ngoName: ngo?.organisationName?.trim() || 'An NGO',
        listingTitle: listing.title,
      })
    }

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

export async function listMyRequestsForNgo(
  ngoId: string,
): Promise<SerializedNgoMyRequestsResult> {
  const requests = await FoodRequest.find({ ngo: ngoId })
    .select('+confirmation.pickupPinHash +confirmation.qrToken')
    .populate({
      path: 'listing',
      select:
        'title quantity quantityUnit photos pickupAddress pickupLocation expiresAt donor',
      populate: {
        path: 'donor',
        model: User,
        select: 'organisationName verification.status role',
      },
    })
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean()

  const serialized = requests
    .filter((request) => request.listing)
    .map((request) =>
      serializeNgoMyRequest(
        request as unknown as Parameters<typeof serializeNgoMyRequest>[0],
      ),
    )

  return {
    requests: serialized,
    counts: countNgoMyRequestsByTab(serialized),
  }
}

async function assertDonorOwnsListing(listingId: string, donorId: string) {
  if (!mongoose.isValidObjectId(listingId)) {
    throw notFound('Listing not found', 'LISTING_NOT_FOUND')
  }

  const listing = await Listing.findById(listingId).lean()

  if (!listing) {
    throw notFound('Listing not found', 'LISTING_NOT_FOUND')
  }

  if (listing.donor.toString() !== donorId) {
    throw forbidden('You do not have access to this listing', 'LISTING_FORBIDDEN')
  }

  return listing
}

export async function listRequestsForDonorListing(input: {
  donorId: string
  listingId: string
}): Promise<{
  requestCount: number
  requests: SerializedDonorListingRequest[]
}> {
  await assertDonorOwnsListing(input.listingId, input.donorId)

  const requests = await FoodRequest.find({
    listing: input.listingId,
    status: { $in: [REQUEST_STATUS.REQUESTED, REQUEST_STATUS.ACCEPTED] },
  })
    .populate({
      path: 'ngo',
      model: User,
      select: 'organisationName dailyCapacity avatarUrl verification.status role',
    })
    .sort({ createdAt: -1 })
    .lean()

  const serialized = requests.map((request) =>
    serializeDonorListingRequest(
      request as Parameters<typeof serializeDonorListingRequest>[0],
    ),
  )

  return {
    requestCount: serialized.length,
    requests: serialized,
  }
}

async function loadAcceptableRequest(requestId: string, donorId: string) {
  if (!mongoose.isValidObjectId(requestId)) {
    throw notFound(REQUEST_MESSAGES.REQUEST_NOT_FOUND, REQUEST_ERROR_CODES.REQUEST_NOT_FOUND)
  }

  const request = await FoodRequest.findById(requestId).lean()

  if (!request) {
    throw notFound(REQUEST_MESSAGES.REQUEST_NOT_FOUND, REQUEST_ERROR_CODES.REQUEST_NOT_FOUND)
  }

  const listing = await assertDonorOwnsListing(request.listing.toString(), donorId)

  return { request, listing }
}

async function tryIdempotentAccept(input: {
  requestId: string
  donorId: string
}): Promise<SerializedAcceptedRequest | null> {
  const { request, listing } = await loadAcceptableRequest(
    input.requestId,
    input.donorId,
  )

  if (
    request.status === REQUEST_STATUS.ACCEPTED &&
    listing.status === LISTING_STATUS.MATCHED
  ) {
    const stored = await FoodRequest.findById(request._id)
      .select('+confirmation.pickupPin')
      .lean()

    const pickupPin = stored?.confirmation?.pickupPin
    if (!pickupPin) {
      throw conflict(
        REQUEST_MESSAGES.REQUEST_ALREADY_HANDLED,
        REQUEST_ERROR_CODES.REQUEST_ALREADY_HANDLED,
      )
    }

    return serializeAcceptedRequest(
      request as Parameters<typeof serializeAcceptedRequest>[0],
      pickupPin,
    )
  }

  return null
}

export async function acceptRequestForDonor(input: {
  donorId: string
  requestId: string
}): Promise<SerializedAcceptedRequest> {
  const idempotent = await tryIdempotentAccept(input)
  if (idempotent) {
    return idempotent
  }

  const { request, listing } = await loadAcceptableRequest(
    input.requestId,
    input.donorId,
  )

  if (request.status !== REQUEST_STATUS.REQUESTED) {
    throw conflict(
      REQUEST_MESSAGES.REQUEST_ALREADY_HANDLED,
      REQUEST_ERROR_CODES.REQUEST_ALREADY_HANDLED,
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
      REQUEST_MESSAGES.LISTING_NOT_ACCEPTING_REQUESTS,
      REQUEST_ERROR_CODES.LISTING_NOT_ACCEPTING_REQUESTS,
    )
  }

  const pickupPin = generatePickupPin()
  const pickupPinHash = await hashPickupPin(pickupPin)
  const qrToken = generateHandoverQrToken()

  const session = await mongoose.startSession()

  try {
    let acceptedRequest: SerializedAcceptedRequest | null = null

    await session.withTransaction(async () => {
      const updatedRequest = await FoodRequest.findOneAndUpdate(
        {
          _id: input.requestId,
          status: REQUEST_STATUS.REQUESTED,
          listing: listing._id,
        },
        {
          $set: {
            status: REQUEST_STATUS.ACCEPTED,
            confirmation: {
              donorConfirmed: false,
              ngoConfirmed: false,
              pickupPin,
              pickupPinHash,
              qrToken,
              pinAttemptCount: 0,
            },
          },
        },
        { session, new: true },
      )

      if (!updatedRequest) {
        throw conflict(
          REQUEST_MESSAGES.REQUEST_ALREADY_HANDLED,
          REQUEST_ERROR_CODES.REQUEST_ALREADY_HANDLED,
        )
      }

      await FoodRequest.updateMany(
        {
          listing: listing._id,
          status: REQUEST_STATUS.REQUESTED,
          _id: { $ne: input.requestId },
        },
        { $set: { status: REQUEST_STATUS.DECLINED } },
        { session },
      )

      const listingUpdate = await Listing.findOneAndUpdate(
        {
          _id: listing._id,
          status: LISTING_STATUS.ACTIVE,
        },
        { $set: { status: LISTING_STATUS.MATCHED } },
        { session, new: true },
      )

      if (!listingUpdate) {
        throw conflict(
          REQUEST_MESSAGES.LISTING_NOT_ACCEPTING_REQUESTS,
          REQUEST_ERROR_CODES.LISTING_NOT_ACCEPTING_REQUESTS,
        )
      }

      acceptedRequest = serializeAcceptedRequest(
        updatedRequest.toObject() as Parameters<typeof serializeAcceptedRequest>[0],
        pickupPin,
      )
    })

    if (!acceptedRequest) {
      throw conflict(
        REQUEST_MESSAGES.REQUEST_ALREADY_HANDLED,
        REQUEST_ERROR_CODES.REQUEST_ALREADY_HANDLED,
      )
    }

    const ngo = (await User.findById(request.ngo)
      .select('organisationName')
      .lean()) as { organisationName?: string | null } | null

    await notifyDonorRequestAccepted({
      donorId: input.donorId,
      requestId: input.requestId,
      listingId: listing._id.toString(),
      ngoName: ngo?.organisationName?.trim() || 'An NGO',
      listingTitle: listing.title,
    })

    return acceptedRequest
  } catch (error) {
    if (error instanceof MongoServerError) {
      throw new AppError(
        REQUEST_MESSAGES.REQUEST_ACCEPT_FAILED,
        500,
        REQUEST_ERROR_CODES.REQUEST_ACCEPT_FAILED,
      )
    }
    throw error
  } finally {
    await session.endSession()
  }
}
