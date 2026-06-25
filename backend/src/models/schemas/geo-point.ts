import { Schema } from 'mongoose'
import { VERIFICATION_STATUS } from '../../constants/enums.js'

/** NGO service location — address always; coordinates optional when geocoding fails */
export const geoPointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
      validate: {
        validator(value: number[] | undefined) {
          if (value === undefined || value === null) {
            return true
          }
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            value[0] >= -180 &&
            value[0] <= 180 &&
            value[1] >= -90 &&
            value[1] <= 90
          )
        },
        message: 'Coordinates must be [longitude, latitude]',
      },
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: false },
)

export const verificationDocumentSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, trim: true },
    resourceType: { type: String, enum: ['image', 'raw'] },
    format: { type: String, trim: true },
    accessType: {
      type: String,
      enum: ['authenticated'],
      default: 'authenticated',
    },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

export const verificationSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
    },
    submittedAt: { type: Date },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, trim: true },
    reasonCode: { type: String, trim: true },
    reasonDetails: { type: String, trim: true },
    documents: {
      type: [verificationDocumentSchema],
      default: [],
    },
  },
  { _id: false },
)
