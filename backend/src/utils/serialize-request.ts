import type { RequestStatus } from '../constants/enums.js'

export type SerializedRequestConfirmation = {
  donorConfirmed: boolean
  ngoConfirmed: boolean
  donorConfirmedAt?: string
  ngoConfirmedAt?: string
  completedAt?: string
  // qrToken and pickupPin omitted — selected false in schema; pickup slice fills these
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

type RequestDocumentLike = {
  _id: { toString(): string }
  listing: { toString(): string }
  ngo: { toString(): string }
  status: RequestStatus
  confirmation?: {
    donorConfirmed?: boolean
    ngoConfirmed?: boolean
    donorConfirmedAt?: Date
    ngoConfirmedAt?: Date
    completedAt?: Date
  }
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

export type SerializedDonorListingRequest = {
  _id: string
  ngoId: string
  ngoName: string
  status: RequestStatus
  createdAt: string
}

type DonorListingRequestRow = RequestDocumentLike & {
  ngo: { _id: { toString(): string }; organisationName?: string | null }
}

export function serializeDonorListingRequest(
  request: DonorListingRequestRow,
): SerializedDonorListingRequest {
  return {
    _id: request._id.toString(),
    ngoId: request.ngo._id.toString(),
    ngoName: request.ngo.organisationName?.trim() || 'Verified NGO',
    status: request.status,
    createdAt: request.createdAt.toISOString(),
  }
}
