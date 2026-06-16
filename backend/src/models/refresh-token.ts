import mongoose, { Schema } from 'mongoose'

const refreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    familyId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    createdByIp: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true },
)

refreshTokenSchema.index({ user: 1 })
refreshTokenSchema.index({ tokenHash: 1 })
refreshTokenSchema.index({ familyId: 1 })
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
