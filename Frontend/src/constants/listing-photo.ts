export const MAX_LISTING_PHOTO_SIZE_MB = 5
export const MAX_LISTING_PHOTO_SIZE_BYTES = MAX_LISTING_PHOTO_SIZE_MB * 1024 * 1024

export const ACCEPTED_LISTING_PHOTO_TYPES = [
  'image/jpeg',
  'image/png',
] as const

export type AcceptedListingPhotoType =
  (typeof ACCEPTED_LISTING_PHOTO_TYPES)[number]

export const ACCEPTED_LISTING_PHOTO_LABEL = 'JPG or PNG'

export const ACCEPTED_LISTING_PHOTO_ACCEPT =
  ACCEPTED_LISTING_PHOTO_TYPES.join(',')

export function isAcceptedListingPhotoType(
  type: string,
): type is AcceptedListingPhotoType {
  return (ACCEPTED_LISTING_PHOTO_TYPES as readonly string[]).includes(type)
}

export function validateListingPhotoFile(file: File): 'type' | 'size' | null {
  if (!isAcceptedListingPhotoType(file.type)) {
    return 'type'
  }

  if (file.size > MAX_LISTING_PHOTO_SIZE_BYTES) {
    return 'size'
  }

  return null
}
