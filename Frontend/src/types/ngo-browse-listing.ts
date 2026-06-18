import type { Listing } from './listing'

export type NgoBrowseDonor = {
  organisationName: string
  verified: true
  createdAt: string
}

/** NGO-facing listing shape from GET /listings/browse and GET /listings/browse/:id */
export type NgoBrowseListing = Omit<Listing, 'donor'> & {
  donor: NgoBrowseDonor
  /** When Request model ships — whether the signed-in NGO already requested this listing */
  hasRequested?: boolean
}