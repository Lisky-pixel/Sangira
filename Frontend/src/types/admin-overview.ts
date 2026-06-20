import type {
  ADMIN_OVERVIEW_ACTIVITY_TYPE,
  ADMIN_OVERVIEW_FLAG_TYPE,
} from '../constants/admin-overview'

export type AdminOverviewActivityType =
  (typeof ADMIN_OVERVIEW_ACTIVITY_TYPE)[keyof typeof ADMIN_OVERVIEW_ACTIVITY_TYPE]

export type AdminOverviewFlagType =
  (typeof ADMIN_OVERVIEW_FLAG_TYPE)[keyof typeof ADMIN_OVERVIEW_FLAG_TYPE]

export type AdminOverviewActivityEvent = {
  id: string
  type: AdminOverviewActivityType
  subject: string
  timestamp: string
  awaitingReview?: boolean
}

export type AdminOverviewFlag = {
  type: AdminOverviewFlagType
  title: string
  detail: string
  count: number
  reviewPath: string
}

export type AdminOverviewStats = {
  pendingVerifications: number
  pendingOverSlaHours: number
  verificationSlaTargetHours: number
  activeListings: number
  transfersThisWeek: number
  transfersLastWeekDelta: number
  registeredOrganisations: number
  registeredBreakdown: { donors: number; ngos: number }
}

export type AdminOverviewData = {
  stats: AdminOverviewStats
  recentActivity: AdminOverviewActivityEvent[]
  flags: AdminOverviewFlag[]
}

export type AdminActivityPagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type ListAdminActivityResult = {
  activity: AdminOverviewActivityEvent[]
  pagination: AdminActivityPagination
}
