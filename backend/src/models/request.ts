import mongoose, { Schema } from 'mongoose'
import { REQUEST_STATUS } from '../constants/enums.js'

const requestSchema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    ngo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.REQUESTED,
    },
    confirmation: {
      // Pickup handover — QR token + PIN generated at accept; confirmation flags used in pickup slice
      donorConfirmed: { type: Boolean, default: false },
      ngoConfirmed: { type: Boolean, default: false },
      /** Donor-only display (select: false); paired with pickupPinHash for NGO verification */
      pickupPin: { type: String, select: false },
      pickupPinHash: { type: String, select: false },
      qrToken: { type: String, select: false },
      pinAttemptCount: { type: Number, default: 0 },
      donorConfirmedAt: { type: Date },
      ngoConfirmedAt: { type: Date },
      completedAt: { type: Date },
    },
    /** Recorded at completion for impact dashboards — meals = servings only; kg separate */
    mealsRedistributed: { type: Number },
    wasteKgPrevented: { type: Number },
  },
  { timestamps: true },
)

requestSchema.index({ listing: 1 })
requestSchema.index({ ngo: 1 })
requestSchema.index(
  { listing: 1, ngo: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: [REQUEST_STATUS.REQUESTED, REQUEST_STATUS.ACCEPTED],
      },
    },
  },
)

export const Request = mongoose.model('Request', requestSchema)
