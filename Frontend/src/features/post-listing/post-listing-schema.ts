import { z } from 'zod'
import {
  FOOD_LABEL_VALUES,
  FOOD_TYPE_VALUES,
  QUANTITY_UNIT_VALUES,
  STORAGE_CONDITION_VALUES,
} from '../../constants/listing-form'
import {
  ACCEPTED_LISTING_PHOTO_LABEL,
  MAX_LISTING_PHOTO_SIZE_MB,
  validateListingPhotoFile,
} from '../../constants/listing-photo'
import { postListingContent } from '../../placeholder/post-listing-content'

export const postListingSchema = z.object({
  foodType: z.enum(FOOD_TYPE_VALUES, {
    error: postListingContent.validation.foodTypeRequired,
  }),
  quantity: z
    .number({
      error: postListingContent.validation.quantityMin,
    })
    .min(1, postListingContent.validation.quantityMin),
  quantityUnit: z.enum(QUANTITY_UNIT_VALUES, {
    error: postListingContent.validation.quantityUnitRequired,
  }),
  photo: z
    .custom<File>(
      (value) => value instanceof File,
      postListingContent.validation.photoRequired,
    )
    .superRefine((file, context) => {
      const error = validateListingPhotoFile(file)
      if (error === 'type') {
        context.addIssue({
          code: 'custom',
          message: postListingContent.validation.photoInvalidType(
            ACCEPTED_LISTING_PHOTO_LABEL,
          ),
        })
      }
      if (error === 'size') {
        context.addIssue({
          code: 'custom',
          message: postListingContent.validation.photoTooLarge(
            MAX_LISTING_PHOTO_SIZE_MB,
          ),
        })
      }
    }),
  expiresAt: z
    .string()
    .min(1, postListingContent.validation.expiresRequired)
    .refine((value) => {
      const date = new Date(value)
      return !Number.isNaN(date.getTime()) && date.getTime() > Date.now()
    }, postListingContent.validation.expiresFuture),
  storageCondition: z.enum(STORAGE_CONDITION_VALUES, {
    error: postListingContent.validation.storageRequired,
  }),
  foodLabels: z.array(z.enum(FOOD_LABEL_VALUES)),
  pickupAddress: z
    .string()
    .trim()
    .min(1, postListingContent.validation.pickupRequired),
  pickupInstructions: z.string().optional(),
})

export type PostListingFormValues = z.infer<typeof postListingSchema>

const optionalPhotoSchema = z
  .custom<File | undefined>(
    (value) => value === undefined || value instanceof File,
  )
  .optional()
  .superRefine((file, context) => {
    if (!file) return
    const error = validateListingPhotoFile(file)
    if (error === 'type') {
      context.addIssue({
        code: 'custom',
        message: postListingContent.validation.photoInvalidType(
          ACCEPTED_LISTING_PHOTO_LABEL,
        ),
      })
    }
    if (error === 'size') {
      context.addIssue({
        code: 'custom',
        message: postListingContent.validation.photoTooLarge(
          MAX_LISTING_PHOTO_SIZE_MB,
        ),
      })
    }
  })

export const editListingSchema = postListingSchema.extend({
  photo: optionalPhotoSchema,
})

export type EditListingFormValues = z.infer<typeof editListingSchema>
