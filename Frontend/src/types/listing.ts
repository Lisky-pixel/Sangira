import type { ListingStatus } from '../constants/listing-status'
import type {
  FoodLabel,
  FoodType,
  QuantityUnit,
  StorageCondition,
} from '../constants/listing-form'

/** Mirrors backend Listing document shape for portal UI */
export type Listing = {
  _id: string
  donor: string
  title: string
  description?: string
  servings: number
  storageConditions?: string
  photos: string[]
  expiresAt: string
  status: ListingStatus
  createdAt: string
  updatedAt: string
  requestCount?: number
  /** Agreed create-listing fields — populated when Listing API ships */
  foodType?: FoodType
  quantity?: number
  quantityUnit?: QuantityUnit
  storageCondition?: StorageCondition
  foodLabels?: FoodLabel[]
  pickupAddress?: string
  pickupInstructions?: string
}
