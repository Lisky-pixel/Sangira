import { z } from 'zod'
import { isModerateOrStrongPassword } from '../utils/password-strength.js'
import { PASSWORD_RESET } from '../constants/password-reset.js'

export const passwordRequestCodeSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
})

export type PasswordRequestCodeInput = z.infer<typeof passwordRequestCodeSchema>

export const passwordVerifySchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  code: z
    .string()
    .regex(/^\d+$/, 'Code must be numeric')
    .length(PASSWORD_RESET.RESET_CODE_LENGTH, 'Enter the 6-digit code'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      isModerateOrStrongPassword,
      'Password must be moderate strength or stronger',
    ),
})

export type PasswordVerifyInput = z.infer<typeof passwordVerifySchema>

