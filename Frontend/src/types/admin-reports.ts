export type AdminReportsWeekday =
  | 'Mon'
  | 'Tue'
  | 'Wed'
  | 'Thu'
  | 'Fri'
  | 'Sat'
  | 'Sun'

export type AdminReportsMealsByDayOfWeek = {
  day: AdminReportsWeekday
  meals: number
}

export type AdminReportsFoodTypeCount = {
  foodType: string
  label: string
  count: number
}

export type AdminReportsRankedOrganisation = {
  organisationName: string
  verified: boolean
  transfers?: number
  pickups?: number
}

export type AdminReportsStats = {
  mealsRedistributed: {
    total: number
    monthOverMonthChangePercent: number | null
  }
  wastePreventedKg: number
  completedTransfers: number
  averageMatchTimeMinutes: number | null
  averageMatchTimeRollingDays: number
}

export type AdminReportsData = {
  stats: AdminReportsStats
  mealsByDayOfWeek: AdminReportsMealsByDayOfWeek[]
  listingsByFoodType: AdminReportsFoodTypeCount[]
  topDonors: AdminReportsRankedOrganisation[]
  mostServedNgos: AdminReportsRankedOrganisation[]
}
