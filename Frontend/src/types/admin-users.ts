import type {
  AdminUserAction,
  AdminUserListRoleFilter,
  AdminUserListStatus,
  AdminUserListStatusFilter,
} from '../constants/admin-users'
import type { AccountStatus } from '../constants/account-status'
import type { UserRole } from '../constants/registration-roles'
import type { VerificationStatus } from '../constants/verification-status'

export type AdminUserListItem = {
  id: string
  organisationName: string
  verified: boolean
  role: UserRole
  sectorLabel: string
  transfersCount: number
  accountStatus: AccountStatus
  listStatus: AdminUserListStatus
}

export type AdminUserPagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type ListAdminUsersResult = {
  users: AdminUserListItem[]
  pagination: AdminUserPagination
}

export type AdminUserDocumentMeta = {
  filename: string
  resourceType?: string
  format?: string
}

export type AdminUserAuditEntry = {
  id: string
  action: AdminUserAction
  actorAdminId: string
  actorAdminName?: string
  reason?: string
  timestamp: string
}

export type AdminUserDetail = {
  id: string
  organisationName: string
  role: UserRole
  contactName: string
  phone: string
  email: string
  accountStatus: AccountStatus
  listStatus: AdminUserListStatus
  verificationStatus: VerificationStatus
  registrationNumber?: string
  dailyCapacity?: number
  transportLabel?: string
  sectorLabel: string
  locationLabel: string
  transfersCount: number
  submittedAt?: string
  verification?: {
    status: VerificationStatus
    reason?: string
    reasonCode?: string
    reasonDetails?: string
    reviewedAt?: string
    reviewedBy?: string
    reviewedByName?: string
    document?: AdminUserDocumentMeta
  }
  auditTrail: AdminUserAuditEntry[]
}

export type AdminUserDocumentView = {
  url: string
}

export type AdminUserActionResult = {
  user: AdminUserDetail
}

export type ListAdminUsersParams = {
  page: number
  pageSize: number
  search?: string
  role: AdminUserListRoleFilter
  status: AdminUserListStatusFilter
}

export type AdminUserOptionalReasonPayload = {
  reason?: string
}

export type AdminUserRequiredReasonPayload = {
  reason: string
}
