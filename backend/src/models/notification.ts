import mongoose, { Schema } from 'mongoose'
import { NOTIFICATION_TYPE } from '../constants/enums.js'

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      required: true,
    },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    relatedListing: { type: Schema.Types.ObjectId, ref: 'Listing' },
    relatedRequest: { type: Schema.Types.ObjectId, ref: 'Request' },
    sentVia: {
      inApp: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
)

notificationSchema.index({ user: 1, createdAt: -1 })
notificationSchema.index({ user: 1, read: 1 })

export const Notification = mongoose.model('Notification', notificationSchema)
