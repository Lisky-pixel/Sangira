import { z } from 'zod'
import { isValidRwandanMobile } from '../utils/phone.js'

export const patchProfileSchema = z
  .object({
    organisationName: z
      .string()
      .trim()
      .min(2, 'Business name must be at least 2 characters')
      .optional(),
    contactName: z
      .string()
      .trim()
      .min(1, 'Contact person is required')
      .optional(),
    phone: z
      .string()
      .trim()
      .refine(isValidRwandanMobile, 'Enter a valid Rwanda mobile number')
      .optional(),
    address: z
      .string()
      .trim()
      .min(1, 'Address is required')
      .optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.organisationName !== undefined ||
      value.contactName !== undefined ||
      value.phone !== undefined ||
      value.address !== undefined,
    { message: 'At least one profile field must be provided' },
  )

export type PatchProfileInput = z.infer<typeof patchProfileSchema>
