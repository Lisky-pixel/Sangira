import { z } from 'zod'
import { ADMIN_REPORTS } from '../constants/admin-reports.js'

export const adminReportsRankingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(ADMIN_REPORTS.MAX_PAGE_SIZE)
    .default(ADMIN_REPORTS.DEFAULT_PAGE_SIZE),
})

export type AdminReportsRankingsQuery = z.infer<
  typeof adminReportsRankingsQuerySchema
>
