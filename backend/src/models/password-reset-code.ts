import mongoose, { Schema } from 'mongoose'

const passwordResetCodeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

passwordResetCodeSchema.index({ user: 1 })
passwordResetCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const PasswordResetCode = mongoose.model(
  'PasswordResetCode',
  passwordResetCodeSchema,
)

