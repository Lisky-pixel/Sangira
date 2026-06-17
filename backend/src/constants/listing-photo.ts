export const MAX_LISTING_PHOTO_SIZE_MB = 5
export const MAX_LISTING_PHOTO_SIZE_BYTES = MAX_LISTING_PHOTO_SIZE_MB * 1024 * 1024

export const ACCEPTED_LISTING_PHOTO_TYPES = [
  'image/jpeg',
  'image/png',
] as const

export type AcceptedListingPhotoMime =
  (typeof ACCEPTED_LISTING_PHOTO_TYPES)[number]

export const LISTING_PHOTO_FIELD = 'photo'

export function isAcceptedListingPhotoMime(
  mime: string,
): mime is AcceptedListingPhotoMime {
  return (ACCEPTED_LISTING_PHOTO_TYPES as readonly string[]).includes(mime)
}
