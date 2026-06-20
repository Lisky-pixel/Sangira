import { z } from 'zod'
import {
  ADMIN_LISTINGS_PAGE,
  ADMIN_LISTING_STATUS_FILTER,
} from '../constants/admin-listings.js'

const statusFilterSchema = z
  .enum([
    ADMIN_LISTING_STATUS_FILTER.ALL,
    ADMIN_LISTING_STATUS_FILTER.ACTIVE,
    ADMIN_LISTING_STATUS_FILTER.AWAITING_PICKUP,
    ADMIN_LISTING_STATUS_FILTER.COMPLETED,
    ADMIN_LISTING_STATUS_FILTER.EXPIRED,
  ])
  .default(ADMIN_LISTING_STATUS_FILTER.ALL)

export const adminListingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(ADMIN_LISTINGS_PAGE.MAX_PAGE_SIZE)
    .default(ADMIN_LISTINGS_PAGE.DEFAULT_PAGE_SIZE),
  status: statusFilterSchema,
})

export type AdminListingsQuery = z.infer<typeof adminListingsQuerySchema>
