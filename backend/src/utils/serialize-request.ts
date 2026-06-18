import type { RequestStatus } from '../constants/enums.js'

export type SerializedRequestConfirmation = {
  donorConfirmed: boolean
  ngoConfirmed: boolean
  donorConfirmedAt?: string
  ngoConfirmedAt?: string
  completedAt?: string
}

export type SerializedRequest = {
  _id: string
  listing: string
  ngo: string
  status: RequestStatus
  confirmation: SerializedRequestConfirmation
  createdAt: string
  updatedAt: string
}

/** Returned once on accept — donor handover page reads pickupPin via owner-only routes */
export type SerializedAcceptedRequest = SerializedRequest & {
  pickupPin: string
}

type RequestDocumentLike = {
  _id: { toString(): string }
  listing: { toString(): string }
  ngo: { toString(): string }
  status: RequestStatus
  confirmation?: {
    donorConfirmed?: boolean
    ngoConfirmed?: boolean
    pickupPin?: string | null
    donorConfirmedAt?: Date
    ngoConfirmedAt?: Date
    completedAt?: Date | null
  } | null
  createdAt: Date
  updatedAt: Date
}

export function serializeRequest(request: RequestDocumentLike): SerializedRequest {
  const confirmation = request.confirmation

  return {
    _id: request._id.toString(),
    listing: request.listing.toString(),
    ngo: request.ngo.toString(),
    status: request.status,
    confirmation: {
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
    },
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  }
}

export function serializeAcceptedRequest(
  request: RequestDocumentLike & { confirmation?: { pickupPin?: string | null } | null },
  pickupPin: string,
): SerializedAcceptedRequest {
  return {
    ...serializeRequest(request),
    pickupPin,
  }
}

export type SerializedDonorListingRequestNgo = {
  organisationName: string
  verified: true
  dailyCapacity: number
  avatarUrl?: string
}

export type SerializedDonorListingRequest = {
  _id: string
  listingId: string
  status: RequestStatus
  createdAt: string
  ngo: SerializedDonorListingRequestNgo
}

type PopulatedNgoRow = {
  _id: { toString(): string }
  organisationName?: string | null
  dailyCapacity?: number | null
  avatarUrl?: string | null
  role?: string
  verification?: { status?: string } | null
}

type DonorListingRequestRow = RequestDocumentLike & {
  ngo: PopulatedNgoRow
}

export function serializeDonorListingRequest(
  request: DonorListingRequestRow,
): SerializedDonorListingRequest {
  const avatarUrl =
    typeof request.ngo.avatarUrl === 'string' && request.ngo.avatarUrl.trim()
      ? request.ngo.avatarUrl.trim()
      : undefined

  return {
    _id: request._id.toString(),
    listingId: request.listing.toString(),
    status: request.status,
    createdAt: request.createdAt.toISOString(),
    ngo: {
      organisationName:
        request.ngo.organisationName?.trim() || 'Verified NGO',
      verified: true,
      dailyCapacity:
        typeof request.ngo.dailyCapacity === 'number'
          ? request.ngo.dailyCapacity
          : 0,
      ...(avatarUrl ? { avatarUrl } : {}),
    },
  }
}
