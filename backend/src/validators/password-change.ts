import { z } from 'zod'
import { isModerateOrStrongPassword } from '../utils/password-strength.js'

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      isModerateOrStrongPassword,
      'Password must be moderate strength or stronger',
    ),
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
