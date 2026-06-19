import type { QuantityUnit } from '../constants/listing-form'
import type { DonorActivityType } from '../constants/donor-activity'

export type DonorImpactTotals = {
  mealsRedistributed: number
  wasteKgPrevented: number
  itemsRedistributed: number
  completedTransfers: number
  ngosServed: number
}

export type DonorImpactThisMonth = {
  meals: number
  wasteKg: number
  items: number
}

export type DonorImpactMonthlyPoint = {
  monthLabel: string
  meals: number
}

export type DonorImpactSummary = {
  totals: DonorImpactTotals
  thisMonth: DonorImpactThisMonth
  monthlySeries: DonorImpactMonthlyPoint[]
  memberSince: string
}

export type DonorNeedsActionItem = {
  requestId: string
  listingId: string
  listingTitle: string
  requestedAt: string
  ngo: {
    organisationName: string
    verified: boolean
    avatarUrl?: string
  }
}

export type DonorActivityEventPayload = {
  listingTitle?: string
  ngoName?: string
  quantity?: number
  quantityUnit?: QuantityUnit
  mealsRedistributed?: number
  wasteKgPrevented?: number
  itemsRedistributed?: number
}

export type DonorActivityEvent = {
  id: string
  type: DonorActivityType
  timestamp: string
  payload: DonorActivityEventPayload
}

export type DonorDashboardData = {
  monthlyImpact: {
    thisMonth: DonorImpactThisMonth
    totals: DonorImpactTotals
    monthlySeries: DonorImpactMonthlyPoint[]
  }
  needsAction: DonorNeedsActionItem[]
  recentActivity: DonorActivityEvent[]
}

export type GetDonorImpactResult = {
  impact: DonorImpactSummary
}

export type GetDonorDashboardResult = {
  dashboard: DonorDashboardData
}

export type DonorActivityPagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type GetDonorActivityResult = {
  activity: DonorActivityEvent[]
  pagination: DonorActivityPagination
}
