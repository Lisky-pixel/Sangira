import { z } from 'zod'
import {
  estimatePasswordStrength,
  MODERATE_PASSWORD_MIN_SCORE,
} from '../../lib/password-strength'
import { donorChangePasswordContent } from '../../placeholder/donor-change-password-content'

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, donorChangePasswordContent.validation.currentRequired),
    newPassword: z
      .string()
      .min(8, donorChangePasswordContent.validation.newMin)
      .refine(
        (value) =>
          estimatePasswordStrength(value).score >= MODERATE_PASSWORD_MIN_SCORE,
        donorChangePasswordContent.validation.newStrength,
      ),
    confirmNewPassword: z
      .string()
      .min(1, donorChangePasswordContent.validation.confirmRequired),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: donorChangePasswordContent.validation.confirmMismatch,
    path: ['confirmNewPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
