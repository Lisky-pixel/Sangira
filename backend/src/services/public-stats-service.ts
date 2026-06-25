import {
  aggregatePlatformImpactTotals,
  countVerifiedOrganisations,
} from './platform-stats-service.js'

export type PublicPlatformStats = {
  mealsRedistributed: number
  wastePreventedKg: number
  verifiedOrganisations: number
}

export async function getPublicPlatformStats(): Promise<PublicPlatformStats> {
  const [impactTotals, verifiedOrganisations] = await Promise.all([
    aggregatePlatformImpactTotals(),
    countVerifiedOrganisations(),
  ])

  return {
    mealsRedistributed: impactTotals.mealsRedistributed,
    wastePreventedKg: impactTotals.wastePreventedKg,
    verifiedOrganisations,
  }
}
