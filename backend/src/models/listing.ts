import mongoose, { Schema } from 'mongoose'
import {
  FOOD_LABEL_VALUES,
  FOOD_TYPE_VALUES,
  QUANTITY_UNIT_VALUES,
  STORAGE_CONDITION_VALUES,
} from '../constants/listing-form.js'
import { LISTING_STATUS } from '../constants/enums.js'
import { listingPickupLocationSchema } from './schemas/listing-pickup-location.js'

const listingSchema = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    foodType: {
      type: String,
      enum: FOOD_TYPE_VALUES,
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    quantityUnit: {
      type: String,
      enum: QUANTITY_UNIT_VALUES,
      required: true,
    },
    storageCondition: {
      type: String,
      enum: STORAGE_CONDITION_VALUES,
      required: true,
    },
    foodLabels: {
      type: [String],
      enum: FOOD_LABEL_VALUES,
      default: [],
    },
    pickupInstructions: { type: String, trim: true },
    pickupAddress: { type: String, required: true, trim: true },
    photos: { type: [String], default: [] },
    pickupLocation: { type: listingPickupLocationSchema, required: false },
    pickupWindow: {
      start: { type: Date },
      end: { type: Date },
    },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(LISTING_STATUS),
      default: LISTING_STATUS.ACTIVE,
    },
  },
  { timestamps: true },
)

listingSchema.index({ donor: 1 })
listingSchema.index({ status: 1, createdAt: -1 })
listingSchema.index({ pickupLocation: '2dsphere' })
listingSchema.index({ expiresAt: 1 })

export const Listing = mongoose.model('Listing', listingSchema)
