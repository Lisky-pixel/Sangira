import type { UserRole } from '../constants/registration-roles'
import type { VerificationRejectReasonCode } from '../constants/verification-reject-reasons'
import type { VerificationStatus } from '../constants/verification-status'

export type VerificationListReview = {
  reviewedBy?: string
  reviewedAt?: string
  action: 'approved' | 'rejected'
}

export type VerificationListItem = {
  id: string
  organisationName: string
  role: UserRole
  sectorLabel: string
  submittedAt: string
  waitingSince: string
  status: VerificationStatus
  review?: VerificationListReview
}

export type VerificationPagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type ListVerificationsResult = {
  items: VerificationListItem[]
  pagination: VerificationPagination
  totalPending: number
}

export type DuplicateCheckResult = {
  hasDuplicates: boolean
  phoneClash?: { organisationName: string }
  registrationNumberClash?: { organisationName: string }
}

export type VerificationDocumentMeta = {
  filename: string
  resourceType?: string
  format?: string
}

export type VerificationReviewMeta = {
  reviewedBy?: string
  reviewedByName?: string
  reviewedAt?: string
  reasonCode?: string
  reason?: string
  reasonDetails?: string
}

export type VerificationDetail = {
  id: string
  organisationName: string
  role: UserRole
  contactName: string
  phone: string
  email: string
  registrationNumber?: string
  dailyCapacity?: number
  transportLabel?: string
  sectorLabel: string
  submittedAt: string
  waitingSince: string
  status: VerificationStatus
  document?: VerificationDocumentMeta
  duplicateCheck: DuplicateCheckResult
  review?: VerificationReviewMeta
}

export type VerificationDocumentView = {
  url: string
  expiresAt: string
}

export type RejectVerificationPayload = {
  reasonCode: VerificationRejectReasonCode
  details?: string
}

export type VerificationDecisionResult = {
  application: VerificationDetail
  pendingCount: number
}

export type VerificationUpdatedPayload = {
  id: string
  newStatus: VerificationStatus
  reviewedBy?: string
  reviewedByName?: string
  reviewedAt?: string
  pendingCount: number
}

export type VerificationNewPayload = {
  item: VerificationListItem
  pendingCount: number
}
