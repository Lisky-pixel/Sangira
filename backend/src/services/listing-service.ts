import mongoose from 'mongoose'
import { uploadListingPhoto } from '../config/cloudinary.js'
import { LISTING_STATUS, REQUEST_STATUS, ROLES, VERIFICATION_STATUS } from '../constants/enums.js'
import {
  LISTING_CANCELLABLE_STATUSES,
  LISTING_CANCEL_REJECT_MESSAGE,
  LISTING_EDITABLE_STATUSES,
  LISTING_EDIT_REJECT_MESSAGE,
} from '../constants/listing-editing.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { Donor, User } from '../models/user.js'
import { geocodeAddress } from './geocoding/geocode-address.js'
import type {
  CreateListingInput,
  UpdateListingInput,
} from '../validators/listing.js'
import { deriveListingTitle } from '../utils/derive-listing-title.js'
import {
  badRequest,
  conflict,
  forbidden,
  notFound,
} from '../utils/app-error.js'
import {
  serializeListing,
  type SerializedListing,
} from '../utils/serialize-listing.js'
import {
  serializeBrowseListing,
  type SerializedBrowseListing,
} from '../utils/serialize-browse-listing.js'

type CreateListingFile = {
  buffer: Buffer
  originalname: string
}

type AcceptedRequestRow = {
  _id: mongoose.Types.ObjectId
  listing: mongoose.Types.ObjectId
  ngo: {
    organisationName?: string
  }
}

function resolvePickupBy(
  pickupWindow: { end?: Date | null } | null | undefined,
  expiresAt: Date,
) {
  const end = pickupWindow?.end ?? undefined
  return (end ?? expiresAt).toISOString()
}

export async function createListingForDonor(input: {
  donorId: string
  data: CreateListingInput
  photo: CreateListingFile
}): Promise<SerializedListing> {
  const photoUpload = await uploadListingPhoto(
    input.photo.buffer,
    input.photo.originalname,
  ).catch(() => {
    throw badRequest('Failed to upload listing photo', 'LISTING_PHOTO_UPLOAD_FAILED')
  })

  const geocoded = await geocodeAddress(input.data.pickupAddress)

  const pickupLocation = geocoded
    ? {
        type: 'Point' as const,
        coordinates: [geocoded.lng, geocoded.lat],
        address: input.data.pickupAddress,
      }
    : undefined

  const title =
    input.data.title ??
    deriveListingTitle({
      quantity: input.data.quantity,
      quantityUnit: input.data.quantityUnit,
      foodType: input.data.foodType,
    })

  const listing = await Listing.create({
    donor: input.donorId,
    title,
    foodType: input.data.foodType,
    quantity: input.data.quantity,
    quantityUnit: input.data.quantityUnit,
    storageCondition: input.data.storageCondition,
    foodLabels: input.data.foodLabels,
    pickupInstructions: input.data.pickupInstructions,
    photos: [photoUpload.secureUrl],
    pickupAddress: input.data.pickupAddress,
    ...(pickupLocation ? { pickupLocation } : {}),
    expiresAt: input.data.expiresAt,
    status: LISTING_STATUS.ACTIVE,
  })

  return serializeListing({
    ...listing.toObject(),
    _id: listing._id,
    donor: listing.donor,
    requestCount: 0,
  })
}

export async function listDonorListings(input: {
  donorId: string
  status?: string
}): Promise<SerializedListing[]> {
  const match: Record<string, unknown> = {
    donor: new mongoose.Types.ObjectId(input.donorId),
  }

  if (input.status) {
    match.status = input.status
  } else {
    match.status = { $ne: LISTING_STATUS.CANCELLED }
  }

  const listings = await Listing.find(match).sort({ createdAt: -1 }).lean()

  if (listings.length === 0) {
    return []
  }

  const listingIds = listings.map((listing) => listing._id)

  const requestCounts = await FoodRequest.aggregate<{
    _id: typeof listingIds[number]
    count: number
  }>([
    { $match: { listing: { $in: listingIds } } },
    { $group: { _id: '$listing', count: { $sum: 1 } } },
  ])

  const pendingCounts = await FoodRequest.aggregate<{
    _id: typeof listingIds[number]
    count: number
  }>([
    {
      $match: {
        listing: { $in: listingIds },
        status: REQUEST_STATUS.REQUESTED,
      },
    },
    { $group: { _id: '$listing', count: { $sum: 1 } } },
  ])

  const countByListingId = new Map(
    requestCounts.map((entry) => [entry._id.toString(), entry.count]),
  )

  const pendingByListingId = new Map(
    pendingCounts.map((entry) => [entry._id.toString(), entry.count]),
  )

  const matchedListingIds = listings
    .filter((listing) => listing.status === LISTING_STATUS.MATCHED)
    .map((listing) => listing._id)

  const acceptedByListingId = new Map<
    string,
    { ngoName: string; pickupBy: string }
  >()

  if (matchedListingIds.length > 0) {
    const acceptedRequests = await FoodRequest.find({
      listing: { $in: matchedListingIds },
      status: REQUEST_STATUS.ACCEPTED,
    })
      .populate({ path: 'ngo', model: User, select: 'organisationName' })
      .lean<AcceptedRequestRow[]>()

    for (const request of acceptedRequests) {
      const listingId = request.listing.toString()
      const listing = listings.find((item) => item._id.toString() === listingId)
      if (!listing || acceptedByListingId.has(listingId)) {
        continue
      }

      acceptedByListingId.set(listingId, {
        ngoName: request.ngo.organisationName?.trim() || 'Verified NGO',
        pickupBy: resolvePickupBy(listing.pickupWindow, listing.expiresAt),
      })
    }
  }

  return listings.map((listing) => {
    const listingId = listing._id.toString()

    return serializeListing({
      ...listing,
      _id: listing._id,
      donor: listing.donor,
      requestCount: countByListingId.get(listingId) ?? 0,
      pendingRequestCount: pendingByListingId.get(listingId) ?? 0,
      awaitingPickup: acceptedByListingId.get(listingId),
    })
  })
}

async function getOwnedListingOrThrow(listingId: string, donorId: string) {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw notFound('Listing not found', 'LISTING_NOT_FOUND')
  }

  const listing = await Listing.findById(listingId)

  if (!listing) {
    throw notFound('Listing not found', 'LISTING_NOT_FOUND')
  }

  if (listing.donor.toString() !== donorId) {
    throw forbidden('You do not have access to this listing', 'LISTING_FORBIDDEN')
  }

  return listing
}

async function enrichListingWithRequestData(
  listing: {
    _id: mongoose.Types.ObjectId
    status: string
    pickupWindow?: { end?: Date | null } | null
    expiresAt: Date
    donor: mongoose.Types.ObjectId
    title: string
    description?: string | null
    foodType: string
    quantity: number
    quantityUnit: string
    storageCondition: string
    foodLabels?: string[]
    pickupInstructions?: string | null
    pickupAddress?: string | null
    photos?: string[] | null
    pickupLocation?: {
      address?: string | null
      coordinates?: number[] | null
    } | null
    createdAt: Date
    updatedAt: Date
  },
): Promise<SerializedListing> {
  const listingId = listing._id

  const [requestCount, pendingRequestCount, acceptedRequest] = await Promise.all([
    FoodRequest.countDocuments({ listing: listingId }),
    FoodRequest.countDocuments({
      listing: listingId,
      status: REQUEST_STATUS.REQUESTED,
    }),
    listing.status === LISTING_STATUS.MATCHED
      ? FoodRequest.findOne({
          listing: listingId,
          status: REQUEST_STATUS.ACCEPTED,
        })
          .populate({ path: 'ngo', model: User, select: 'organisationName' })
          .lean<AcceptedRequestRow | null>()
      : Promise.resolve(null),
  ])

  const awaitingPickup =
    acceptedRequest && listing.status === LISTING_STATUS.MATCHED
      ? {
          ngoName:
            acceptedRequest.ngo.organisationName?.trim() || 'Verified NGO',
          pickupBy: resolvePickupBy(listing.pickupWindow, listing.expiresAt),
        }
      : undefined

  return serializeListing({
    ...listing,
    _id: listing._id,
    donor: listing.donor,
    requestCount,
    pendingRequestCount,
    awaitingPickup,
  } as Parameters<typeof serializeListing>[0])
}

export async function getListingForDonor(input: {
  donorId: string
  listingId: string
}): Promise<SerializedListing> {
  const listing = await getOwnedListingOrThrow(input.listingId, input.donorId)
  return enrichListingWithRequestData(listing.toObject())
}

export async function updateListingForDonor(input: {
  donorId: string
  listingId: string
  data: UpdateListingInput
  photo?: CreateListingFile
}): Promise<SerializedListing> {
  const listing = await getOwnedListingOrThrow(input.listingId, input.donorId)

  if (
    !LISTING_EDITABLE_STATUSES.includes(
      listing.status as (typeof LISTING_EDITABLE_STATUSES)[number],
    )
  ) {
    throw conflict(LISTING_EDIT_REJECT_MESSAGE, 'LISTING_NOT_EDITABLE')
  }

  let photoUrl: string | undefined

  if (input.photo) {
    const photoUpload = await uploadListingPhoto(
      input.photo.buffer,
      input.photo.originalname,
    ).catch(() => {
      throw badRequest(
        'Failed to upload listing photo',
        'LISTING_PHOTO_UPLOAD_FAILED',
      )
    })
    photoUrl = photoUpload.secureUrl
  }

  const addressChanged = listing.pickupAddress !== input.data.pickupAddress

  if (addressChanged) {
    const geocoded = await geocodeAddress(input.data.pickupAddress)

    const pickupLocation = geocoded
      ? {
          type: 'Point' as const,
          coordinates: [geocoded.lng, geocoded.lat],
          address: input.data.pickupAddress,
        }
      : undefined

    if (pickupLocation) {
      listing.pickupLocation = pickupLocation
    } else {
      listing.set('pickupLocation', undefined)
    }
  }

  const title =
    input.data.title ??
    deriveListingTitle({
      quantity: input.data.quantity,
      quantityUnit: input.data.quantityUnit,
      foodType: input.data.foodType,
    })

  listing.title = title
  listing.foodType = input.data.foodType
  listing.quantity = input.data.quantity
  listing.quantityUnit = input.data.quantityUnit
  listing.storageCondition = input.data.storageCondition
  listing.foodLabels = input.data.foodLabels
  listing.pickupInstructions = input.data.pickupInstructions
  listing.pickupAddress = input.data.pickupAddress
  listing.expiresAt = input.data.expiresAt

  if (photoUrl) {
    listing.photos = [photoUrl]
  }

  await listing.save()

  return enrichListingWithRequestData(listing.toObject())
}

export async function cancelListingForDonor(input: {
  donorId: string
  listingId: string
}): Promise<SerializedListing> {
  const listing = await getOwnedListingOrThrow(input.listingId, input.donorId)

  if (
    !LISTING_CANCELLABLE_STATUSES.includes(
      listing.status as (typeof LISTING_CANCELLABLE_STATUSES)[number],
    )
  ) {
    throw conflict(LISTING_CANCEL_REJECT_MESSAGE, 'LISTING_NOT_CANCELLABLE')
  }

  listing.status = LISTING_STATUS.CANCELLED
  await listing.save()

  return enrichListingWithRequestData(listing.toObject())
}

export async function browseActiveListingsForNgo(): Promise<
  SerializedBrowseListing[]
> {
  const verifiedDonors = await Donor.find({
    role: ROLES.DONOR,
    'verification.status': VERIFICATION_STATUS.APPROVED,
  })
    .select('_id organisationName createdAt')
    .lean()

  if (verifiedDonors.length === 0) {
    return []
  }

  const donorMetaById = new Map(
    verifiedDonors.map((donor) => [
      donor._id.toString(),
      {
        organisationName: donor.organisationName?.trim() || 'Verified donor',
        createdAt: donor.createdAt,
      },
    ]),
  )
  const donorIds = verifiedDonors.map((donor) => donor._id)
  const now = new Date()

  const listings = await Listing.find({
    donor: { $in: donorIds },
    status: LISTING_STATUS.ACTIVE,
    expiresAt: { $gt: now },
  })
    .sort({ createdAt: -1 })
    .lean()

  if (listings.length === 0) {
    return []
  }

  const listingIds = listings.map((listing) => listing._id)

  const pendingCounts = await FoodRequest.aggregate<{
    _id: typeof listingIds[number]
    count: number
  }>([
    {
      $match: {
        listing: { $in: listingIds },
        status: REQUEST_STATUS.REQUESTED,
      },
    },
    { $group: { _id: '$listing', count: { $sum: 1 } } },
  ])

  const pendingByListingId = new Map(
    pendingCounts.map((entry) => [entry._id.toString(), entry.count]),
  )

  return listings
    .filter((listing) => (pendingByListingId.get(listing._id.toString()) ?? 0) === 0)
    .map((listing) => {
      const donorMeta = donorMetaById.get(listing.donor.toString())
      return serializeBrowseListing({
        ...listing,
        donor: listing.donor,
        donorOrganisationName: donorMeta?.organisationName ?? 'Verified donor',
        donorCreatedAt: donorMeta?.createdAt ?? listing.createdAt,
      })
    })
}

export async function getBrowseListingForNgo(
  listingId: string,
): Promise<SerializedBrowseListing> {
  if (!mongoose.isValidObjectId(listingId)) {
    throw notFound('Listing not found', 'LISTING_NOT_FOUND')
  }

  const listing = await Listing.findById(listingId).lean()
  const now = new Date()

  if (
    !listing ||
    listing.status !== LISTING_STATUS.ACTIVE ||
    listing.expiresAt <= now
  ) {
    throw notFound('Listing not found', 'LISTING_NOT_FOUND')
  }

  const donor = await Donor.findOne({
    _id: listing.donor,
    role: ROLES.DONOR,
    'verification.status': VERIFICATION_STATUS.APPROVED,
  })
    .select('organisationName createdAt')
    .lean()

  if (!donor) {
    throw notFound('Listing not found', 'LISTING_NOT_FOUND')
  }

  const pendingRequestCount = await FoodRequest.countDocuments({
    listing: listing._id,
    status: REQUEST_STATUS.REQUESTED,
  })

  if (pendingRequestCount > 0) {
    throw notFound('Listing not found', 'LISTING_NOT_FOUND')
  }

  return serializeBrowseListing({
    ...listing,
    donor: listing.donor,
    donorOrganisationName: donor.organisationName?.trim() || 'Verified donor',
    donorCreatedAt: donor.createdAt,
  })
}
