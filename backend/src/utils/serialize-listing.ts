import type { ListingStatus } from '../constants/enums.js'
import type {
  FoodLabel,
  FoodType,
  QuantityUnit,
  StorageCondition,
} from '../constants/listing-form.js'

export type SerializedListing = {
  _id: string
  donor: string
  title: string
  description?: string
  foodType: FoodType
  quantity: number
  quantityUnit: QuantityUnit
  storageCondition: StorageCondition
  foodLabels: FoodLabel[]
  pickupInstructions?: string
  photos: string[]
  pickupAddress?: string
  expiresAt: string
  status: ListingStatus
  createdAt: string
  updatedAt: string
  requestCount?: number
  pendingRequestCount?: number
  awaitingPickup?: {
    ngoName: string
    pickupBy: string
  }
}

type ListingDocumentLike = {
  _id: { toString(): string }
  donor: { toString(): string }
  title: string
  description?: string | null
  foodType: FoodType
  quantity: number
  quantityUnit: QuantityUnit
  storageCondition: StorageCondition
  foodLabels?: FoodLabel[]
  pickupInstructions?: string | null
  pickupAddress?: string | null
  photos?: string[] | null
  pickupLocation?: {
    address?: string | null
    coordinates?: number[] | null
  } | null
  expiresAt: Date
  status: ListingStatus
  createdAt: Date
  updatedAt: Date
  requestCount?: number
  pendingRequestCount?: number
  awaitingPickup?: {
    ngoName: string
    pickupBy: string
  }
}

export function serializeListing(
  listing: ListingDocumentLike,
): SerializedListing {
  return {
    _id: listing._id.toString(),
    donor: listing.donor.toString(),
    title: listing.title,
    description: listing.description ?? undefined,
    foodType: listing.foodType,
    quantity: listing.quantity,
    quantityUnit: listing.quantityUnit,
    storageCondition: listing.storageCondition,
    foodLabels: listing.foodLabels ?? [],
    pickupInstructions: listing.pickupInstructions ?? undefined,
    photos: listing.photos ?? [],
    pickupAddress:
      listing.pickupAddress ?? listing.pickupLocation?.address ?? undefined,
    expiresAt: listing.expiresAt.toISOString(),
    status: listing.status,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
    ...(listing.requestCount !== undefined
      ? { requestCount: listing.requestCount }
      : {}),
    ...(listing.pendingRequestCount !== undefined
      ? { pendingRequestCount: listing.pendingRequestCount }
      : {}),
    ...(listing.awaitingPickup ? { awaitingPickup: listing.awaitingPickup } : {}),
  }
}
