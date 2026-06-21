import { z } from 'zod'
import { ROLES } from '../constants/enums.js'
import { DAILY_CAPACITY_MIN } from '../constants/ngo-registration.js'
import { isValidRwandanMobile } from '../utils/phone.js'
import { isModerateOrStrongPassword } from '../utils/password-strength.js'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine(
    isModerateOrStrongPassword,
    'Password must be moderate strength or stronger',
  )

const termsAcceptedSchema = z.preprocess((value) => {
  if (value === 'true' || value === true) return true
  if (value === 'false' || value === false) return false
  return value
}, z.literal(true, { message: 'You must accept the Terms and Conditions' }))

const registerBaseSchema = z.object({
  organisationName: z
    .string()
    .min(2, 'Organisation name must be at least 2 characters'),
  contactName: z.string().min(1, 'Contact name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(isValidRwandanMobile, 'Enter a valid Rwanda mobile number'),
  email: z.string().email('Enter a valid email address'),
  password: passwordSchema,
  termsAccepted: termsAcceptedSchema,
})

export const registerDonorSchema = registerBaseSchema.extend({
  role: z.literal(ROLES.DONOR),
})

export const registerNgoSchema = registerBaseSchema.extend({
  role: z.literal(ROLES.NGO),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  dailyCapacity: z.coerce
    .number()
    .min(DAILY_CAPACITY_MIN, 'Daily capacity must be 0 or greater'),
  transportAvailable: z.preprocess((value) => {
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    return value
  }, z.boolean()),
})

export const registerSchema = z.discriminatedUnion('role', [
  registerDonorSchema,
  registerNgoSchema,
])

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
