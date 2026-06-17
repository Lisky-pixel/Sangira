import type {
  FoodLabel,
  FoodType,
  QuantityUnit,
  StorageCondition,
} from '../constants/listing-form'

/** Payload for PATCH /listings/:id (multipart) — photo optional */
export type UpdateListingPayload = {
  foodType: FoodType
  quantity: number
  quantityUnit: QuantityUnit
  photo?: File
  expiresAt: string
  storageCondition: StorageCondition
  foodLabels: FoodLabel[]
  pickupAddress: string
  pickupInstructions?: string
}
