export const MAX_AVATAR_PHOTO_SIZE_MB = 5
export const MAX_AVATAR_PHOTO_SIZE_BYTES = MAX_AVATAR_PHOTO_SIZE_MB * 1024 * 1024

export const ACCEPTED_AVATAR_PHOTO_TYPES = [
  'image/jpeg',
  'image/png',
] as const

export type AcceptedAvatarPhotoMime =
  (typeof ACCEPTED_AVATAR_PHOTO_TYPES)[number]

export const AVATAR_PHOTO_FIELD = 'avatar'

export function isAcceptedAvatarPhotoMime(
  mime: string,
): mime is AcceptedAvatarPhotoMime {
  return (ACCEPTED_AVATAR_PHOTO_TYPES as readonly string[]).includes(mime)
}
