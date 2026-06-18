import type { SerializedListing } from './serialize-listing.js'
import { serializeListing } from './serialize-listing.js'

export type SerializedBrowseDonor = {
  organisationName: string
  verified: true
}

export type SerializedBrowseListing = Omit<SerializedListing, 'donor'> & {
  donor: SerializedBrowseDonor
}

type BrowseListingDocumentLike = Parameters<typeof serializeListing>[0] & {
  donorOrganisationName: string
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
    },
  }
}
