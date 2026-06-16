import mongoose, { Schema } from 'mongoose'
import { LISTING_STATUS } from '../constants/enums.js'
import { geoPointSchema } from './schemas/geo-point.js'

const listingSchema = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    servings: { type: Number, required: true, min: 1 },
    storageConditions: { type: String, trim: true },
    photos: { type: [String], default: [] },
    pickupLocation: { type: geoPointSchema },
    pickupWindow: {
      start: { type: Date },
      end: { type: Date },
    },
    expiresAt: { type: Date },
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
