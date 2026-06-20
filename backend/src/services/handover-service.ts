import mongoose from 'mongoose'
import { MongoServerError } from 'mongodb'
import {
  HANDOVER_ERROR_CODES,
  HANDOVER_MESSAGES,
  HANDOVER_PIN,
} from '../constants/handover.js'
import {
  LISTING_STATUS,
  REQUEST_STATUS,
  ROLES,
  type ListingStatus,
  type RequestStatus,
  type Role,
} from '../constants/enums.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'
import { emitHandoverUpdated } from '../realtime/handover-events.js'
import { notifyDonorTransferComplete, notifyNgoTransferComplete } from './notification-service.js'
import {
  AppError,
  badRequest,
  conflict,
  forbidden,
  notFound,
} from '../utils/app-error.js'
import type { HandoverCondition } from '../constants/handover-condition.js'
import { verifyPickupPin } from '../utils/handover-credentials.js'
import { computeHandoverImpact } from '../utils/handover-impact.js'
import {
  buildHandoverUpdatedPayload,
  serializeHandoverView,
  type ConfirmReceiptResult,
  type HandoverUpdatedPayload,
  type SerializedHandoverView,
} from '../utils/serialize-handover.js'
import { REQUEST_ERROR_CODES, REQUEST_MESSAGES } from '../constants/request.js'

type HandoverParticipantRole = 'donor' | 'ngo'

type HandoverContext = {
  requestId: string
  request: {
    _id: mongoose.Types.ObjectId
    listing: mongoose.Types.ObjectId
    ngo: mongoose.Types.ObjectId
    status: RequestStatus
    confirmation?: {
      donorConfirmed?: boolean
      ngoConfirmed?: boolean
      pickupPin?: string | null
      pickupPinHash?: string | null
      qrToken?: string | null
      pinAttemptCount?: number
      donorConfirmedAt?: Date
      ngoConfirmedAt?: Date
      completedAt?: Date | null
    } | null
  }
  listing: {
    _id: mongoose.Types.ObjectId
    donor: mongoose.Types.ObjectId
    title: string
    quantity: number
    quantityUnit: import('../constants/listing-form.js').QuantityUnit
    expiresAt: Date
    photos?: string[] | null
    status: ListingStatus
  }
  role: HandoverParticipantRole
}

const HANDOVER_VIEW_STATUSES = [
  REQUEST_STATUS.ACCEPTED,
  REQUEST_STATUS.COMPLETED,
] as const

const HANDOVER_CREDENTIAL_SELECT =
  '+confirmation.pickupPin +confirmation.qrToken +confirmation.pickupPinHash'

function assertObjectId(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw notFound(REQUEST_MESSAGES.REQUEST_NOT_FOUND, REQUEST_ERROR_CODES.REQUEST_NOT_FOUND)
  }
}

async function loadHandoverContext(
  requestId: string,
  userId: string,
  options?: { includeCredentials?: boolean },
): Promise<HandoverContext> {
  assertObjectId(requestId)

  const query = FoodRequest.findById(requestId)
  if (options?.includeCredentials) {
    query.select(HANDOVER_CREDENTIAL_SELECT)
  } else {
    query.select('+confirmation.pickupPinHash')
  }

  const request = await query.lean()
  if (!request) {
    throw notFound(REQUEST_MESSAGES.REQUEST_NOT_FOUND, REQUEST_ERROR_CODES.REQUEST_NOT_FOUND)
  }

  const listing = await Listing.findById(request.listing).lean()
  if (!listing) {
    throw notFound(REQUEST_MESSAGES.REQUEST_NOT_FOUND, REQUEST_ERROR_CODES.REQUEST_NOT_FOUND)
  }

  const donorId = listing.donor.toString()
  const ngoId = request.ngo.toString()

  let role: HandoverParticipantRole | null = null
  if (userId === donorId) {
    role = 'donor'
  } else if (userId === ngoId) {
    role = 'ngo'
  }

  if (!role) {
    throw forbidden(
      HANDOVER_MESSAGES.HANDOVER_FORBIDDEN,
      HANDOVER_ERROR_CODES.HANDOVER_FORBIDDEN,
    )
  }

  if (
    !HANDOVER_VIEW_STATUSES.includes(
      request.status as (typeof HANDOVER_VIEW_STATUSES)[number],
    )
  ) {
    throw conflict(
      HANDOVER_MESSAGES.HANDOVER_NOT_AVAILABLE,
      HANDOVER_ERROR_CODES.HANDOVER_NOT_AVAILABLE,
    )
  }

  return {
    requestId,
    request: request as HandoverContext['request'],
    listing: listing as HandoverContext['listing'],
    role,
  }
}

function assertHandoverInProgress(context: HandoverContext) {
  if (context.request.status !== REQUEST_STATUS.ACCEPTED) {
    if (context.request.status === REQUEST_STATUS.COMPLETED) {
      throw conflict(
        HANDOVER_MESSAGES.HANDOVER_ALREADY_COMPLETED,
        HANDOVER_ERROR_CODES.HANDOVER_ALREADY_COMPLETED,
      )
    }

    throw conflict(
      HANDOVER_MESSAGES.HANDOVER_NOT_AVAILABLE,
      HANDOVER_ERROR_CODES.HANDOVER_NOT_AVAILABLE,
    )
  }

  if (context.request.confirmation?.completedAt) {
    throw conflict(
      HANDOVER_MESSAGES.HANDOVER_ALREADY_COMPLETED,
      HANDOVER_ERROR_CODES.HANDOVER_ALREADY_COMPLETED,
    )
  }
}

async function loadOtherParty(
  context: HandoverContext,
): Promise<{ organisationName?: string | null; verification?: { status?: string } | null }> {
  const otherPartyId =
    context.role === 'donor'
      ? context.request.ngo.toString()
      : context.listing.donor.toString()

  const user = (await User.findById(otherPartyId)
    .select('organisationName verification.status')
    .lean()) as {
    organisationName?: string | null
    verification?: { status?: string } | null
  } | null

  if (!user) {
    throw notFound(REQUEST_MESSAGES.REQUEST_NOT_FOUND, REQUEST_ERROR_CODES.REQUEST_NOT_FOUND)
  }

  return {
    organisationName: user.organisationName,
    verification: user.verification,
  }
}

export async function getHandoverView(input: {
  userId: string
  requestId: string
}): Promise<SerializedHandoverView> {
  const context = await loadHandoverContext(input.requestId, input.userId, {
    includeCredentials: true,
  })
  const otherParty = await loadOtherParty(context)

  return serializeHandoverView({
    request: context.request,
    listing: context.listing,
    otherParty,
    includeCredentials: context.role === 'donor',
  })
}

async function tryCompleteHandover(input: {
  requestId: string
  listingId: string
  quantity: number
  quantityUnit: HandoverContext['listing']['quantityUnit']
}): Promise<HandoverUpdatedPayload | null> {
  const now = new Date()
  const impact = computeHandoverImpact(input.quantity, input.quantityUnit)
  const session = await mongoose.startSession()

  try {
    let payload: HandoverUpdatedPayload | null = null

    await session.withTransaction(async () => {
      const updatedRequest = await FoodRequest.findOneAndUpdate(
        {
          _id: input.requestId,
          status: REQUEST_STATUS.ACCEPTED,
          'confirmation.donorConfirmed': true,
          'confirmation.ngoConfirmed': true,
          'confirmation.completedAt': { $exists: false },
        },
        {
          $set: {
            status: REQUEST_STATUS.COMPLETED,
            'confirmation.completedAt': now,
            mealsRedistributed: impact.mealsRedistributed,
            wasteKgPrevented: impact.wasteKgPrevented,
            itemsRedistributed: impact.itemsRedistributed,
          },
        },
        { session, new: true },
      )

      if (!updatedRequest) {
        return
      }

      const listingUpdate = await Listing.findOneAndUpdate(
        {
          _id: input.listingId,
          status: LISTING_STATUS.MATCHED,
        },
        { $set: { status: LISTING_STATUS.COMPLETED } },
        { session },
      )

      if (!listingUpdate) {
        throw conflict(
          HANDOVER_MESSAGES.HANDOVER_NOT_AVAILABLE,
          HANDOVER_ERROR_CODES.HANDOVER_NOT_AVAILABLE,
        )
      }

      payload = buildHandoverUpdatedPayload(
        updatedRequest.toObject() as Parameters<typeof buildHandoverUpdatedPayload>[0],
      )
    })

    if (payload) {
      await Promise.all([
        notifyDonorTransferComplete({
          requestId: input.requestId,
          listingId: input.listingId,
        }),
        notifyNgoTransferComplete({
          requestId: input.requestId,
          listingId: input.listingId,
        }),
      ])
    }

    return payload
  } catch (error) {
    if (error instanceof MongoServerError) {
      throw new AppError(
        HANDOVER_MESSAGES.HANDOVER_COMPLETE_FAILED,
        500,
        HANDOVER_ERROR_CODES.HANDOVER_COMPLETE_FAILED,
      )
    }
    throw error
  } finally {
    await session.endSession()
  }
}

async function finalizeHandoverStep(input: {
  requestId: string
  listingId: string
  quantity: number
  quantityUnit: HandoverContext['listing']['quantityUnit']
  updatedRequest: HandoverContext['request']
}): Promise<ConfirmReceiptResult> {
  const donorConfirmed = input.updatedRequest.confirmation?.donorConfirmed ?? false
  const ngoConfirmed = input.updatedRequest.confirmation?.ngoConfirmed ?? false

  if (donorConfirmed && ngoConfirmed) {
    const completed = await tryCompleteHandover({
      requestId: input.requestId,
      listingId: input.listingId,
      quantity: input.quantity,
      quantityUnit: input.quantityUnit,
    })

    if (completed) {
      emitHandoverUpdated(input.requestId, completed)
      const impact = computeHandoverImpact(input.quantity, input.quantityUnit)
      return {
        handover: completed,
        impact: {
          mealsRedistributed: impact.mealsRedistributed,
          wasteKgPrevented: impact.wasteKgPrevented,
          itemsRedistributed: impact.itemsRedistributed,
        },
      }
    }

    const completedRequest = await FoodRequest.findById(input.requestId).lean()
    if (
      completedRequest &&
      completedRequest.status === REQUEST_STATUS.COMPLETED
    ) {
      const payload = buildHandoverUpdatedPayload(
        completedRequest as Parameters<typeof buildHandoverUpdatedPayload>[0],
      )
      emitHandoverUpdated(input.requestId, payload)
      const impact = computeHandoverImpact(input.quantity, input.quantityUnit)
      return {
        handover: payload,
        impact: {
          mealsRedistributed: impact.mealsRedistributed,
          wasteKgPrevented: impact.wasteKgPrevented,
          itemsRedistributed: impact.itemsRedistributed,
        },
      }
    }
  }

  const payload = buildHandoverUpdatedPayload(
    input.updatedRequest as Parameters<typeof buildHandoverUpdatedPayload>[0],
  )
  emitHandoverUpdated(input.requestId, payload)
  return { handover: payload }
}

export async function confirmHandoverForDonor(input: {
  donorId: string
  requestId: string
}): Promise<HandoverUpdatedPayload> {
  const context = await loadHandoverContext(input.requestId, input.donorId)

  if (context.role !== 'donor') {
    throw forbidden(
      HANDOVER_MESSAGES.HANDOVER_FORBIDDEN,
      HANDOVER_ERROR_CODES.HANDOVER_FORBIDDEN,
    )
  }

  assertHandoverInProgress(context)

  if (context.request.confirmation?.donorConfirmed) {
    throw conflict(
      HANDOVER_MESSAGES.DONOR_ALREADY_CONFIRMED,
      HANDOVER_ERROR_CODES.DONOR_ALREADY_CONFIRMED,
    )
  }

  const now = new Date()
  const updatedRequest = await FoodRequest.findOneAndUpdate(
    {
      _id: input.requestId,
      status: REQUEST_STATUS.ACCEPTED,
      'confirmation.donorConfirmed': false,
      'confirmation.completedAt': { $exists: false },
    },
    {
      $set: {
        'confirmation.donorConfirmed': true,
        'confirmation.donorConfirmedAt': now,
      },
    },
    { new: true },
  ).lean()

  if (!updatedRequest) {
    throw conflict(
      HANDOVER_MESSAGES.HANDOVER_NOT_AVAILABLE,
      HANDOVER_ERROR_CODES.HANDOVER_NOT_AVAILABLE,
    )
  }

  const result = await finalizeHandoverStep({
    requestId: input.requestId,
    listingId: context.listing._id.toString(),
    quantity: context.listing.quantity,
    quantityUnit: context.listing.quantityUnit,
    updatedRequest: updatedRequest as HandoverContext['request'],
  })

  return result.handover
}

export async function confirmReceiptForNgo(input: {
  ngoId: string
  requestId: string
  pin: string
  condition: HandoverCondition
  note?: string
}): Promise<ConfirmReceiptResult> {
  const context = await loadHandoverContext(input.requestId, input.ngoId, {
    includeCredentials: true,
  })

  if (context.role !== 'ngo') {
    throw forbidden(
      HANDOVER_MESSAGES.HANDOVER_FORBIDDEN,
      HANDOVER_ERROR_CODES.HANDOVER_FORBIDDEN,
    )
  }

  assertHandoverInProgress(context)

  if (context.request.confirmation?.ngoConfirmed) {
    throw conflict(
      HANDOVER_MESSAGES.NGO_ALREADY_CONFIRMED,
      HANDOVER_ERROR_CODES.NGO_ALREADY_CONFIRMED,
    )
  }

  const pinAttemptCount = context.request.confirmation?.pinAttemptCount ?? 0
  if (pinAttemptCount >= HANDOVER_PIN.MAX_ATTEMPTS) {
    throw new AppError(
      HANDOVER_MESSAGES.TOO_MANY_PIN_ATTEMPTS,
      429,
      HANDOVER_ERROR_CODES.TOO_MANY_PIN_ATTEMPTS,
    )
  }

  const pickupPinHash = context.request.confirmation?.pickupPinHash
  if (!pickupPinHash) {
    throw conflict(
      HANDOVER_MESSAGES.HANDOVER_NOT_AVAILABLE,
      HANDOVER_ERROR_CODES.HANDOVER_NOT_AVAILABLE,
    )
  }

  const pinMatches = await verifyPickupPin(input.pin, pickupPinHash)
  if (!pinMatches) {
    await FoodRequest.updateOne(
      { _id: input.requestId, status: REQUEST_STATUS.ACCEPTED },
      { $inc: { 'confirmation.pinAttemptCount': 1 } },
    )

    throw badRequest(
      HANDOVER_MESSAGES.INCORRECT_PIN,
      HANDOVER_ERROR_CODES.INCORRECT_PIN,
    )
  }

  // TODO: pickup slice — QR-scan confirm path would set ngoConfirmed here (deferred; no camera lib)

  const now = new Date()
  const conditionReport = {
    condition: input.condition,
    reportedAt: now,
    ...(input.note ? { note: input.note } : {}),
  }

  const updatedRequest = await FoodRequest.findOneAndUpdate(
    {
      _id: input.requestId,
      status: REQUEST_STATUS.ACCEPTED,
      'confirmation.ngoConfirmed': false,
      'confirmation.completedAt': { $exists: false },
    },
    {
      $set: {
        'confirmation.ngoConfirmed': true,
        'confirmation.ngoConfirmedAt': now,
        'confirmation.conditionReport': conditionReport,
      },
    },
    { new: true },
  ).lean()

  if (!updatedRequest) {
    throw conflict(
      HANDOVER_MESSAGES.HANDOVER_NOT_AVAILABLE,
      HANDOVER_ERROR_CODES.HANDOVER_NOT_AVAILABLE,
    )
  }

  return finalizeHandoverStep({
    requestId: input.requestId,
    listingId: context.listing._id.toString(),
    quantity: context.listing.quantity,
    quantityUnit: context.listing.quantityUnit,
    updatedRequest: updatedRequest as HandoverContext['request'],
  })
}

export async function authorizeHandoverRoomJoin(input: {
  userId: string
  role: Role
  requestId: string
}): Promise<void> {
  assertObjectId(input.requestId)

  const request = await FoodRequest.findById(input.requestId).lean()
  if (!request) {
    throw notFound(REQUEST_MESSAGES.REQUEST_NOT_FOUND, REQUEST_ERROR_CODES.REQUEST_NOT_FOUND)
  }

  const listing = await Listing.findById(request.listing).select('donor').lean()
  if (!listing) {
    throw notFound(REQUEST_MESSAGES.REQUEST_NOT_FOUND, REQUEST_ERROR_CODES.REQUEST_NOT_FOUND)
  }

  const donorId = listing.donor.toString()
  const ngoId = request.ngo.toString()
  const isDonor = input.role === ROLES.DONOR && input.userId === donorId
  const isNgo = input.role === ROLES.NGO && input.userId === ngoId

  if (!isDonor && !isNgo) {
    throw forbidden(
      HANDOVER_MESSAGES.HANDOVER_FORBIDDEN,
      HANDOVER_ERROR_CODES.HANDOVER_FORBIDDEN,
    )
  }

  if (
    !HANDOVER_VIEW_STATUSES.includes(
      request.status as (typeof HANDOVER_VIEW_STATUSES)[number],
    )
  ) {
    throw conflict(
      HANDOVER_MESSAGES.HANDOVER_NOT_AVAILABLE,
      HANDOVER_ERROR_CODES.HANDOVER_NOT_AVAILABLE,
    )
  }
}
