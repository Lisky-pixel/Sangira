import { z } from 'zod'
import { DAILY_CAPACITY_MIN } from '../../constants/ngo-registration'
import { registerStep3Content } from '../../placeholder/register-content'
import { termsContent } from '../../placeholder/terms-content'

const termsAcceptedSchema = z.boolean().refine((value) => value, {
  message: termsContent.validationRequired,
})

export const registerStep3DonorSchema = z.object({
  termsAccepted: termsAcceptedSchema,
})

export const registerStep3NgoSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, registerStep3Content.validation.registrationNumberRequired),
  dailyCapacity: z
    .number()
    .min(DAILY_CAPACITY_MIN, registerStep3Content.validation.dailyCapacityMin),
  transportAvailable: z.boolean(),
  termsAccepted: termsAcceptedSchema,
})

export type RegisterStep3DonorFormValues = z.infer<
  typeof registerStep3DonorSchema
>

export type RegisterStep3NgoFormValues = z.infer<typeof registerStep3NgoSchema>
