import { z } from 'zod'

export const devNotificationsTestSchema = z.object({
  to: z.string().email('Enter a valid email address'),
  subject: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
})

export type DevNotificationsTestInput = z.infer<typeof devNotificationsTestSchema>

