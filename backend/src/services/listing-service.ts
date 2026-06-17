import mongoose from 'mongoose'
import { uploadListingPhoto } from '../config/cloudinary.js'
import { LISTING_STATUS, REQUEST_STATUS } from '../constants/enums.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'
import { geocodeAddress } from './geocoding/geocode-address.js'
import type { CreateListingInput } from '../validators/listing.js'
import { deriveListingTitle } from '../utils/derive-listing-title.js'
import { badRequest } from '../utils/app-error.js'
import {
  serializeListing,
  type SerializedListing,
} from '../utils/serialize-listing.js'

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
