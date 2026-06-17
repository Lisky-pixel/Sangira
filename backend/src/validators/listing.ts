import { z } from 'zod'
import {
  FOOD_LABEL_VALUES,
  FOOD_TYPE_VALUES,
  QUANTITY_UNIT_VALUES,
  STORAGE_CONDITION_VALUES,
} from '../constants/listing-form.js'
import { LISTING_STATUS_VALUES } from '../constants/enums.js'

function parseFoodLabels(value: unknown) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      return []
    }

    try {
      return JSON.parse(trimmed) as unknown
    } catch {
      return value
    }
  }

  return []
}

export const createListingSchema = z.object({
  foodType: z.enum(FOOD_TYPE_VALUES),
  quantity: z.coerce.number().min(1, 'Quantity must be greater than 0'),
  quantityUnit: z.enum(QUANTITY_UNIT_VALUES),
  expiresAt: z.coerce
    .date()
    .refine((value) => value.getTime() > Date.now(), {
      message: 'Expiry must be in the future',
    }),
  storageCondition: z.enum(STORAGE_CONDITION_VALUES),
  foodLabels: z.preprocess(
    parseFoodLabels,
    z.array(z.enum(FOOD_LABEL_VALUES)).default([]),
  ),
  pickupAddress: z.string().trim().min(1, 'Pickup address is required'),
  pickupInstructions: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  title: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
})

export type CreateListingInput = z.infer<typeof createListingSchema>

export const listMineListingsQuerySchema = z.object({
  status: z.enum(LISTING_STATUS_VALUES).optional(),
})

export type ListMineListingsQuery = z.infer<typeof listMineListingsQuerySchema>
