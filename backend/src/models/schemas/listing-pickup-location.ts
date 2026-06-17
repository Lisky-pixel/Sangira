import { Schema } from 'mongoose'

/** Listing pickup — address always; coordinates optional when geocoding fails */
export const listingPickupLocationSchema = new Schema(
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
