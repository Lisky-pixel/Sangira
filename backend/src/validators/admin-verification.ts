import { z } from 'zod'
import { ADMIN_VERIFICATION_PAGE } from '../constants/admin-verification.js'
import {
  VERIFICATION_REJECT_REASON_VALUES,
} from '../constants/verification-reject-reasons.js'

const rejectReasonCodeSchema = z
  .string()
  .refine(
    (value): value is (typeof VERIFICATION_REJECT_REASON_VALUES)[number] =>
      (VERIFICATION_REJECT_REASON_VALUES as readonly string[]).includes(value),
    'Invalid rejection reason',
  )

export const adminVerificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(ADMIN_VERIFICATION_PAGE.MAX_PAGE_SIZE)
    .default(ADMIN_VERIFICATION_PAGE.DEFAULT_PAGE_SIZE),
})

export type AdminVerificationsQuery = z.infer<typeof adminVerificationsQuerySchema>

export const adminVerificationIdParamSchema = z.object({
  id: z.string().min(1),
})

export type AdminVerificationIdParam = z.infer<typeof adminVerificationIdParamSchema>

export const rejectVerificationSchema = z.object({
  reasonCode: rejectReasonCodeSchema,
  details: z.string().trim().max(500).optional(),
})

export type RejectVerificationInput = z.infer<typeof rejectVerificationSchema>
