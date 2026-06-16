import { z } from 'zod'
import { RWANDA_MOBILE_REGEX } from '../../constants/phone'
import {
  estimatePasswordStrength,
  MODERATE_PASSWORD_MIN_SCORE,
} from '../../lib/password-strength'
import { registerStep2Content } from '../../placeholder/register-content'

export const registerStep2Schema = z.object({
  organisationName: z
    .string()
    .min(2, registerStep2Content.validation.organisationNameMin),
  contactName: z
    .string()
    .min(1, registerStep2Content.validation.contactNameRequired),
  phone: z
    .string()
    .min(1, registerStep2Content.validation.phoneRequired)
    .regex(RWANDA_MOBILE_REGEX, registerStep2Content.validation.phoneInvalid),
  email: z.string().email(registerStep2Content.validation.emailInvalid),
  password: z
    .string()
    .min(8, registerStep2Content.validation.passwordMin)
    .refine(
      (value) =>
        estimatePasswordStrength(value).score >= MODERATE_PASSWORD_MIN_SCORE,
      registerStep2Content.validation.passwordStrength,
    ),
})

export type RegisterStep2FormValues = z.infer<typeof registerStep2Schema>
