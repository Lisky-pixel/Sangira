import mongoose from 'mongoose'
import { REQUEST_STATUS, ROLES } from '../constants/enums.js'
import { MONGO_READ_PREFERENCE_PRIMARY } from '../constants/mongo.js'
import {
  TRANSFER_RECEIPT_ERROR_CODES,
  TRANSFER_RECEIPT_MESSAGES,
} from '../constants/transfer-receipt.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'
import { forbidden, notFound } from '../utils/app-error.js'
import {
  serializeTransferReceipt,
  type SerializedTransferReceipt,
} from '../utils/serialize-transfer-receipt.js'

type CompletedRequestRow = {
  _id: mongoose.Types.ObjectId
  listing: mongoose.Types.ObjectId
  ngo: mongoose.Types.ObjectId
  status: string
  mealsRedistributed?: number | null
  wasteKgPrevented?: number | null
  itemsRedistributed?: number | null
  confirmation?: {
    completedAt?: Date | null
    conditionReport?: {
      condition: import('../constants/handover-condition.js').HandoverCondition
      note?: string | null
      reportedAt: Date
    } | null
  } | null
}

function assertObjectId(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw notFound(
      TRANSFER_RECEIPT_MESSAGES.REQUEST_NOT_FOUND,
      TRANSFER_RECEIPT_ERROR_CODES.REQUEST_NOT_FOUND,
    )
  }
}

function assertReceiptAvailable(request: CompletedRequestRow) {
  if (request.status !== REQUEST_STATUS.COMPLETED) {
    throw notFound(
      TRANSFER_RECEIPT_MESSAGES.RECEIPT_NOT_AVAILABLE,
      TRANSFER_RECEIPT_ERROR_CODES.RECEIPT_NOT_AVAILABLE,
    )
  }

  const completedAt = request.confirmation?.completedAt
  const conditionReport = request.confirmation?.conditionReport

  if (!completedAt || !conditionReport) {
    throw notFound(
      TRANSFER_RECEIPT_MESSAGES.RECEIPT_NOT_AVAILABLE,
      TRANSFER_RECEIPT_ERROR_CODES.RECEIPT_NOT_AVAILABLE,
    )
  }
}

function assertReceiptAccess(input: {
  userId: string
  role: string
  donorId: string
  ngoId: string
}) {
  if (input.role === ROLES.ADMIN) {
    return
  }

  if (input.userId === input.donorId || input.userId === input.ngoId) {
    return
  }

  throw forbidden(
    TRANSFER_RECEIPT_MESSAGES.RECEIPT_FORBIDDEN,
    TRANSFER_RECEIPT_ERROR_CODES.RECEIPT_FORBIDDEN,
  )
}

type PartyRow = {
  organisationName?: string | null
  verification?: { status?: string } | null
}

export async function getTransferReceipt(input: {
  userId: string
  role: string
  requestId: string
}): Promise<SerializedTransferReceipt> {
  assertObjectId(input.requestId)

  const request = await FoodRequest.findById(input.requestId)
    .read(MONGO_READ_PREFERENCE_PRIMARY)
    .lean<CompletedRequestRow | null>()

  if (!request) {
    throw notFound(
      TRANSFER_RECEIPT_MESSAGES.REQUEST_NOT_FOUND,
      TRANSFER_RECEIPT_ERROR_CODES.REQUEST_NOT_FOUND,
    )
  }

  assertReceiptAvailable(request)

  const listing = await Listing.findById(request.listing)
    .read(MONGO_READ_PREFERENCE_PRIMARY)
    .lean()

  if (!listing) {
    throw notFound(
      TRANSFER_RECEIPT_MESSAGES.REQUEST_NOT_FOUND,
      TRANSFER_RECEIPT_ERROR_CODES.REQUEST_NOT_FOUND,
    )
  }

  const [donor, ngo] = await Promise.all([
    User.findById(listing.donor)
      .select('organisationName verification')
      .read(MONGO_READ_PREFERENCE_PRIMARY)
      .lean<PartyRow>(),
    User.findById(request.ngo)
      .select('organisationName verification')
      .read(MONGO_READ_PREFERENCE_PRIMARY)
      .lean<PartyRow>(),
  ])

  if (!donor || !ngo) {
    throw notFound(
      TRANSFER_RECEIPT_MESSAGES.REQUEST_NOT_FOUND,
      TRANSFER_RECEIPT_ERROR_CODES.REQUEST_NOT_FOUND,
    )
  }

  assertReceiptAccess({
    userId: input.userId,
    role: input.role,
    donorId: listing.donor.toString(),
    ngoId: request.ngo.toString(),
  })

  const completedAt = request.confirmation!.completedAt!
  const conditionReport = request.confirmation!.conditionReport!

  return serializeTransferReceipt({
    request: {
      _id: request._id,
      mealsRedistributed: request.mealsRedistributed,
      wasteKgPrevented: request.wasteKgPrevented,
      itemsRedistributed: request.itemsRedistributed,
      confirmation: {
        completedAt,
        conditionReport,
      },
    },
    listing,
    donor,
    ngo,
  })
}
