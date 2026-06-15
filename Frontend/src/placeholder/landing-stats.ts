export type LandingStat = {
  value: string
  label: string
}

// TODO: source from live API when impact metrics endpoint is available
export const placeholderLandingStats: LandingStat[] = [
  { value: '11,656', label: 'MEALS REDISTRIBUTED' },
  { value: '2', label: 'TONNES WASTE PREVENTED' },
  { value: '53', label: 'VERIFIED ORGANISATIONS' },
]
