import type { ListingStatus } from '../constants/listing-status'
import type {
  FoodLabel,
  FoodType,
  QuantityUnit,
  StorageCondition,
} from '../constants/listing-form'

export type ListingPickupLocation = {
  address: string
  coordinates?: [number, number]
}

/** Mirrors backend Listing document shape for portal UI */
export type Listing = {
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
  pickupLocation?: ListingPickupLocation
  /** @deprecated Prefer pickupLocation.coordinates */
  pickupCoordinates?: [number, number]
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
  completedRequestId?: string
}
