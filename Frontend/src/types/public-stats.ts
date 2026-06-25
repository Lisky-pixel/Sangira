export type PublicPlatformStats = {
  mealsRedistributed: number
  wastePreventedKg: number
  verifiedOrganisations: number
}

export type GetPublicStatsResult = {
  stats: PublicPlatformStats
}
