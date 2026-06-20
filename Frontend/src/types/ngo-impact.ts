export type NgoImpactTotals = {
  completedPickups: number
  mealsReceived: number
}

export type NgoImpactSummary = {
  totals: NgoImpactTotals
}

export type GetNgoImpactResult = {
  impact: NgoImpactSummary
}
