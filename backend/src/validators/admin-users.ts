import { z } from 'zod'
import { ADMIN_USERS_PAGE } from '../constants/admin-users.js'
import {
  ADMIN_USER_LIST_ROLE_FILTER,
  ADMIN_USER_LIST_STATUS_FILTER,
} from '../constants/admin-users.js'

const roleFilterSchema = z
  .enum([
    ADMIN_USER_LIST_ROLE_FILTER.ALL,
    ADMIN_USER_LIST_ROLE_FILTER.DONOR,
    ADMIN_USER_LIST_ROLE_FILTER.NGO,
  ])
  .default(ADMIN_USER_LIST_ROLE_FILTER.ALL)

const statusFilterSchema = z
  .enum([
    ADMIN_USER_LIST_STATUS_FILTER.ALL,
    ADMIN_USER_LIST_STATUS_FILTER.ACTIVE,
    ADMIN_USER_LIST_STATUS_FILTER.FLAGGED,
    ADMIN_USER_LIST_STATUS_FILTER.SUSPENDED,
    ADMIN_USER_LIST_STATUS_FILTER.REVOKED,
  ])
  .default(ADMIN_USER_LIST_STATUS_FILTER.ALL)

export const adminUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(ADMIN_USERS_PAGE.MAX_PAGE_SIZE)
    .default(ADMIN_USERS_PAGE.DEFAULT_PAGE_SIZE),
  search: z.string().trim().max(120).optional(),
  role: roleFilterSchema,
  status: statusFilterSchema,
})

export type AdminUsersQuery = z.infer<typeof adminUsersQuerySchema>

export const adminUserIdParamSchema = z.object({
  id: z.string().min(1),
})

export type AdminUserIdParam = z.infer<typeof adminUserIdParamSchema>

export const adminUserOptionalReasonSchema = z.object({
  reason: z.string().trim().max(500).optional(),
})

export const adminUserRequiredReasonSchema = z.object({
  reason: z.string().trim().min(1).max(500),
})

export type AdminUserOptionalReasonInput = z.infer<
  typeof adminUserOptionalReasonSchema
>

export type AdminUserRequiredReasonInput = z.infer<
  typeof adminUserRequiredReasonSchema
>
