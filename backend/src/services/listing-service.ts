import mongoose from 'mongoose'
import { uploadListingPhoto } from '../config/cloudinary.js'
import { LISTING_STATUS } from '../constants/enums.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
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

  const countByListingId = new Map(
    requestCounts.map((entry) => [entry._id.toString(), entry.count]),
  )

  return listings.map((listing) =>
    serializeListing({
      ...listing,
      _id: listing._id,
      donor: listing.donor,
      requestCount: countByListingId.get(listing._id.toString()) ?? 0,
    }),
  )
}
