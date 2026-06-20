import { z } from 'zod'
import { isValidRwandanMobile } from '../utils/phone.js'

export const updateAdminProfileSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name').optional(),
    phone: z
      .union([
        z
          .string()
          .trim()
          .refine(isValidRwandanMobile, 'Enter a valid phone number'),
        z.literal(''),
        z.null(),
      ])
      .optional(),
  })
  .strict()
  .refine((value) => value.name !== undefined || value.phone !== undefined, {
    message: 'At least one field must be provided',
  })

export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>

export const updatePlatformSettingsSchema = z.object({
  verificationSlaTargetHours: z.coerce.number().int().min(1).max(168),
})

export type UpdatePlatformSettingsInput = z.infer<
  typeof updatePlatformSettingsSchema
>
