import type {
  AdminListingDisplayStatus,
  AdminListingStatusFilter,
} from '../constants/admin-listings'

export type AdminListingListItem = {
  id: string
  title: string
  donor: {
    organisationName: string
    verified: boolean
  }
  quantity: number
  quantityUnit: string
  quantityLabel: string
  postedAt: string
  expiresAt: string
  displayStatus: AdminListingDisplayStatus
  requestsCount: number
}

export type AdminListingStatusCounts = {
  all: number
  active: number
  awaiting_pickup: number
  completed: number
  expired: number
}

export type AdminListingPagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type ListAdminListingsResult = {
  listings: AdminListingListItem[]
  pagination: AdminListingPagination
  statusCounts: AdminListingStatusCounts
  insights: {
    unmatchedExpiredThisMonth: number
  }
}

export type ListAdminListingsParams = {
  page: number
  pageSize: number
  status: AdminListingStatusFilter
}
