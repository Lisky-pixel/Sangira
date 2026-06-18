import type { RequestStatus } from '../constants/enums.js'
import type { QuantityUnit } from '../constants/listing-form.js'
import type { SerializedRequestConfirmation } from './serialize-request.js'

export type SerializedHandoverParty = {
  organisationName: string
  verified: boolean
}

export type SerializedHandoverListing = {
  title: string
  quantity: number
  quantityUnit: QuantityUnit
  expiresAt: string
}

export type SerializedHandoverView = {
  requestId: string
  status: RequestStatus
  listing: SerializedHandoverListing
  otherParty: SerializedHandoverParty
  confirmation: SerializedRequestConfirmation
  pickupPin?: string
  qrToken?: string
}

export type HandoverUpdatedPayload = {
  requestId: string
  donorConfirmed: boolean
  ngoConfirmed: boolean
  status: RequestStatus
  completedAt?: string
}

type HandoverListingLike = {
  title: string
  quantity: number
  quantityUnit: QuantityUnit
  expiresAt: Date
}

type HandoverPartyLike = {
  organisationName?: string | null
  verification?: { status?: string } | null
}

type HandoverRequestLike = {
  _id: { toString(): string }
  status: RequestStatus
  confirmation?: {
    donorConfirmed?: boolean
    ngoConfirmed?: boolean
    pickupPin?: string | null
    qrToken?: string | null
    donorConfirmedAt?: Date
    ngoConfirmedAt?: Date
    completedAt?: Date | null
  } | null
}

function serializeParty(party: HandoverPartyLike): SerializedHandoverParty {
  return {
    organisationName: party.organisationName?.trim() || 'Verified organisation',
    verified: party.verification?.status === 'approved',
  }
}

function serializeConfirmation(
  confirmation: HandoverRequestLike['confirmation'],
): SerializedRequestConfirmation {
  return {
    donorConfirmed: confirmation?.donorConfirmed ?? false,
    ngoConfirmed: confirmation?.ngoConfirmed ?? false,
    ...(confirmation?.donorConfirmedAt
      ? { donorConfirmedAt: confirmation.donorConfirmedAt.toISOString() }
      : {}),
    ...(confirmation?.ngoConfirmedAt
      ? { ngoConfirmedAt: confirmation.ngoConfirmedAt.toISOString() }
      : {}),
    ...(confirmation?.completedAt
      ? { completedAt: confirmation.completedAt.toISOString() }
      : {}),
  }
}

export function serializeHandoverView(input: {
  request: HandoverRequestLike
  listing: HandoverListingLike
  otherParty: HandoverPartyLike
  includeCredentials: boolean
}): SerializedHandoverView {
  const confirmation = input.request.confirmation
  const view: SerializedHandoverView = {
    requestId: input.request._id.toString(),
    status: input.request.status,
    listing: {
      title: input.listing.title,
      quantity: input.listing.quantity,
      quantityUnit: input.listing.quantityUnit,
      expiresAt: input.listing.expiresAt.toISOString(),
    },
    otherParty: serializeParty(input.otherParty),
    confirmation: serializeConfirmation(confirmation),
  }

  if (input.includeCredentials) {
    const pickupPin = confirmation?.pickupPin
    const qrToken = confirmation?.qrToken
    if (pickupPin) {
      view.pickupPin = pickupPin
    }
    if (qrToken) {
      view.qrToken = qrToken
    }
  }

  return view
}

export function buildHandoverUpdatedPayload(
  request: HandoverRequestLike,
): HandoverUpdatedPayload {
  const confirmation = request.confirmation

  return {
    requestId: request._id.toString(),
    donorConfirmed: confirmation?.donorConfirmed ?? false,
    ngoConfirmed: confirmation?.ngoConfirmed ?? false,
    status: request.status,
    ...(confirmation?.completedAt
      ? { completedAt: confirmation.completedAt.toISOString() }
      : {}),
  }
}
