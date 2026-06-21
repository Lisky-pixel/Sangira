import {
  LISTING_STATUS,
  REQUEST_STATUS,
  type ListingStatus,
  type RequestStatus,
} from '../constants/enums.js'
import type { QuantityUnit } from '../constants/listing-form.js'
import {
  NGO_DECLINED_REASON,
  NGO_EXPIRED_REASON,
} from '../constants/ngo-requests.js'
import {
  isListingExpiredByTime,
  resolveEffectiveListingStatus,
} from './resolve-effective-listing-status.js'
import type { SerializedPickupLocation } from './serialize-listing.js'

export type SerializedNgoMyRequestListing = {
  _id: string
  title: string
  quantity: number
  quantityUnit: QuantityUnit
  photos: string[]
  pickupAddress?: string
  pickupLocation?: SerializedPickupLocation
  pickupCoordinates?: [number, number]
  expiresAt: string
}

export type SerializedNgoMyRequestDonor = {
  organisationName: string
  verified: boolean
}

export type SerializedNgoMyRequest = {
  _id: string
  listingId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
  listing: SerializedNgoMyRequestListing
  donor: SerializedNgoMyRequestDonor
  handoverReady?: boolean
  completedAt?: string
  declinedAt?: string
  declinedReason?: string
  expiredAt?: string
  expiredReason?: string
}

export type SerializedNgoMyRequestsResult = {
  requests: SerializedNgoMyRequest[]
  counts: {
    pending: number
    accepted: number
    completed: number
    declined: number
    expired: number
  }
}

type PopulatedDonorLike = {
  organisationName?: string | null
  verification?: { status?: string } | null
}

type PopulatedListingLike = {
  _id: { toString(): string }
  title: string
  quantity: number
  quantityUnit: QuantityUnit
  photos?: string[] | null
  pickupAddress?: string | null
  pickupLocation?: {
    address?: string | null
    coordinates?: number[] | null
  } | null
  expiresAt: Date
  status: ListingStatus
  donor: PopulatedDonorLike
}

type NgoMyRequestRow = {
  _id: { toString(): string }
  listing: PopulatedListingLike
  status: RequestStatus
  createdAt: Date
  updatedAt: Date
  confirmation?: {
    pickupPinHash?: string | null
    qrToken?: string | null
    completedAt?: Date | null
  } | null
}

function serializePickupLocation(
  pickupLocation: PopulatedListingLike['pickupLocation'],
): SerializedPickupLocation | undefined {
  if (!pickupLocation) {
    return undefined
  }

  const address = pickupLocation.address?.trim()
  const coordinates =
    Array.isArray(pickupLocation.coordinates) &&
    pickupLocation.coordinates.length === 2
      ? ([pickupLocation.coordinates[0], pickupLocation.coordinates[1]] as [
          number,
          number,
        ])
      : undefined

  if (!address && !coordinates) {
    return undefined
  }

  return {
    address: address ?? '',
    ...(coordinates ? { coordinates } : {}),
  }
}

function serializeListing(
  listing: PopulatedListingLike,
): SerializedNgoMyRequestListing {
  const pickupLocation = serializePickupLocation(listing.pickupLocation)
  const pickupAddress = listing.pickupAddress?.trim()

  return {
    _id: listing._id.toString(),
    title: listing.title,
    quantity: listing.quantity,
    quantityUnit: listing.quantityUnit,
    photos: listing.photos ?? [],
    ...(pickupAddress ? { pickupAddress } : {}),
    ...(pickupLocation ? { pickupLocation } : {}),
    ...(pickupLocation?.coordinates
      ? { pickupCoordinates: pickupLocation.coordinates }
      : {}),
    expiresAt: listing.expiresAt.toISOString(),
  }
}

function serializeDonor(donor: PopulatedDonorLike): SerializedNgoMyRequestDonor {
  return {
    organisationName: donor.organisationName?.trim() || 'Verified donor',
    verified: donor.verification?.status === 'approved',
  }
}

function resolveSerializedRequestStatus(
  request: NgoMyRequestRow,
  now = new Date(),
): RequestStatus {
  if (request.status !== REQUEST_STATUS.REQUESTED) {
    return request.status
  }

  const effectiveListingStatus = resolveEffectiveListingStatus(
    request.listing.status,
    request.listing.expiresAt,
    now,
  )

  if (
    effectiveListingStatus === LISTING_STATUS.EXPIRED ||
    isListingExpiredByTime(request.listing.expiresAt, now)
  ) {
    return REQUEST_STATUS.EXPIRED
  }

  return request.status
}

export function serializeNgoMyRequest(
  request: NgoMyRequestRow,
  now = new Date(),
): SerializedNgoMyRequest {
  const status = resolveSerializedRequestStatus(request, now)

  const serialized: SerializedNgoMyRequest = {
    _id: request._id.toString(),
    listingId: request.listing._id.toString(),
    status,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    listing: serializeListing(request.listing),
    donor: serializeDonor(request.listing.donor),
  }

  if (status === REQUEST_STATUS.ACCEPTED) {
    const handoverReady = Boolean(
      request.confirmation?.pickupPinHash && request.confirmation?.qrToken,
    )
    if (handoverReady) {
      serialized.handoverReady = true
    }
  }

  if (status === REQUEST_STATUS.COMPLETED) {
    const completedAt = request.confirmation?.completedAt
    if (completedAt) {
      serialized.completedAt = completedAt.toISOString()
    }
  }

  if (status === REQUEST_STATUS.DECLINED) {
    serialized.declinedAt = request.updatedAt.toISOString()
    serialized.declinedReason = NGO_DECLINED_REASON.ANOTHER_ORGANISATION_ACCEPTED
  }

  if (status === REQUEST_STATUS.EXPIRED) {
    serialized.expiredAt = request.updatedAt.toISOString()
    serialized.expiredReason = NGO_EXPIRED_REASON.LISTING_EXPIRED_UNFULFILLED
  }

  return serialized
}

export function countNgoMyRequestsByTab(
  requests: SerializedNgoMyRequest[],
): SerializedNgoMyRequestsResult['counts'] {
  return {
    pending: requests.filter((r) => r.status === REQUEST_STATUS.REQUESTED).length,
    accepted: requests.filter((r) => r.status === REQUEST_STATUS.ACCEPTED).length,
    completed: requests.filter((r) => r.status === REQUEST_STATUS.COMPLETED).length,
    declined: requests.filter((r) => r.status === REQUEST_STATUS.DECLINED).length,
    expired: requests.filter((r) => r.status === REQUEST_STATUS.EXPIRED).length,
  }
}
