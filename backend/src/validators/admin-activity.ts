import { z } from 'zod'
import { ADMIN_ACTIVITY_PAGE } from '../constants/admin-activity.js'

export const adminActivityQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(ADMIN_ACTIVITY_PAGE.MAX_PAGE_SIZE)
    .default(ADMIN_ACTIVITY_PAGE.DEFAULT_PAGE_SIZE),
})

export type AdminActivityQuery = z.infer<typeof adminActivityQuerySchema>
