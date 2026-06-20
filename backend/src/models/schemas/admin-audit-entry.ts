import { Schema } from 'mongoose'
import { ADMIN_USER_ACTION_VALUES } from '../../constants/admin-user-actions.js'

export const adminAuditEntrySchema = new Schema(
  {
    action: {
      type: String,
      enum: ADMIN_USER_ACTION_VALUES,
      required: true,
    },
    actorAdminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actorAdminName: { type: String, trim: true },
    reason: { type: String, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true },
)
