import { z } from 'zod'
import { DONOR_ACTIVITY_PAGE } from '../constants/impact.js'

export const donorActivityQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(DONOR_ACTIVITY_PAGE.MAX_PAGE_SIZE)
    .default(DONOR_ACTIVITY_PAGE.DEFAULT_PAGE_SIZE),
})

export type DonorActivityQuery = z.infer<typeof donorActivityQuerySchema>
