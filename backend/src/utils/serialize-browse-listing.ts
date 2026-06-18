import type { SerializedListing } from './serialize-listing.js'
import { serializeListing } from './serialize-listing.js'

export type SerializedBrowseDonor = {
  organisationName: string
  verified: true
  createdAt: string
}

export type SerializedBrowseListing = Omit<SerializedListing, 'donor'> & {
  donor: SerializedBrowseDonor
  /** Present on NGO detail reads — whether the signed-in NGO has an active request */
  hasRequested?: boolean
}

type BrowseListingDocumentLike = Parameters<typeof serializeListing>[0] & {
  donorOrganisationName: string
  donorCreatedAt: Date
}

export function serializeBrowseListing(
  listing: BrowseListingDocumentLike,
): SerializedBrowseListing {
  const base = serializeListing(listing)

  return {
    ...base,
    donor: {
      organisationName: listing.donorOrganisationName,
      verified: true,
      createdAt: listing.donorCreatedAt.toISOString(),
    },
  }
}
