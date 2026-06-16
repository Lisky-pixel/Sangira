import { z } from 'zod'
import { signInContent } from '../../placeholder/sign-in-content'
import { isValidRwandanMobile } from '../../constants/phone'
import { isEmail } from '../../lib/identifier'

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(1, signInContent.validation.identifierRequired)
    .refine(
      (value) => isEmail(value) || isValidRwandanMobile(value),
      signInContent.validation.identifierInvalid,
    ),
  password: z.string().min(1, signInContent.validation.passwordRequired),
})

export type SignInFormValues = z.infer<typeof signInSchema>
