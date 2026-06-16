import { z } from 'zod'
import { signInContent } from '../../placeholder/sign-in-content'

export const signInSchema = z.object({
  email: z.string().email(signInContent.validation.emailInvalid),
  password: z.string().min(1, signInContent.validation.passwordRequired),
})

export type SignInFormValues = z.infer<typeof signInSchema>
