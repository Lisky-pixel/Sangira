import type { Listing } from './listing'

export type NgoBrowseDonor = {
  organisationName: string
  verified: true
}

export type NgoBrowseListing = Omit<Listing, 'donor'> & {
  donor: NgoBrowseDonor
}
