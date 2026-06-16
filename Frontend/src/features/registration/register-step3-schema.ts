import { z } from 'zod'
import { DAILY_CAPACITY_MIN } from '../../constants/ngo-registration'
import { registerStep3Content } from '../../placeholder/register-content'

const confirmedSchema = z.boolean().refine((value) => value, {
  message: registerStep3Content.validation.confirmationRequired,
})

export const registerStep3DonorSchema = z.object({
  confirmed: confirmedSchema,
})

export const registerStep3NgoSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, registerStep3Content.validation.registrationNumberRequired),
  dailyCapacity: z
    .number()
    .min(DAILY_CAPACITY_MIN, registerStep3Content.validation.dailyCapacityMin),
  transportAvailable: z.boolean(),
  confirmed: confirmedSchema,
})

export type RegisterStep3DonorFormValues = z.infer<
  typeof registerStep3DonorSchema
>

export type RegisterStep3NgoFormValues = z.infer<typeof registerStep3NgoSchema>
