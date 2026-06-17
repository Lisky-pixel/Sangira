import type {
  FoodLabel,
  FoodType,
  QuantityUnit,
  StorageCondition,
} from '../constants/listing-form'

/** Payload for POST /listings (multipart) — mirrors agreed Listing create shape */
export type CreateListingPayload = {
  foodType: FoodType
  quantity: number
  quantityUnit: QuantityUnit
  photos: File[]
  expiresAt: string
  storageCondition: StorageCondition
  foodLabels: FoodLabel[]
  pickupAddress: string
  pickupInstructions?: string
}
