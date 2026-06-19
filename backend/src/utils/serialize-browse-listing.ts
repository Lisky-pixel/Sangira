import type { SerializedListing } from './serialize-listing.js'
import { serializeListing } from './serialize-listing.js'
import { resolveAvatarUrl } from './resolve-avatar-url.js'

export type SerializedBrowseDonor = {
  organisationName: string
  verified: true
  createdAt: string
  completedTransfers: number
  avatarUrl?: string
}

export type SerializedBrowseListing = Omit<SerializedListing, 'donor'> & {
  donor: SerializedBrowseDonor
  /** Present on NGO detail reads — whether the signed-in NGO has an active request */
  hasRequested?: boolean
}

type BrowseListingDocumentLike = Parameters<typeof serializeListing>[0] & {
  donorOrganisationName: string
  donorCreatedAt: Date
  donorCompletedTransfers: number
  donorAvatarUrl?: string | null
  /** @deprecated Legacy donor field — fallback when donorAvatarUrl is empty */
  donorLegacyProfileImageUrl?: string | null
}

export function serializeBrowseListing(
  listing: BrowseListingDocumentLike,
): SerializedBrowseListing {
  const base = serializeListing(listing)
  const avatarUrl = resolveAvatarUrl({
    avatarUrl: listing.donorAvatarUrl,
    profileImageUrl: listing.donorLegacyProfileImageUrl,
  })

  return {
    ...base,
    donor: {
      organisationName: listing.donorOrganisationName,
      verified: true,
      createdAt: listing.donorCreatedAt.toISOString(),
      completedTransfers: listing.donorCompletedTransfers,
      ...(avatarUrl ? { avatarUrl } : {}),
    },
  }
}
