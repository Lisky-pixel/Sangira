export const CLOUDINARY_AUTHENTICATED_ACCESS_TYPE = 'authenticated' as const

export type CloudinaryAccessType = typeof CLOUDINARY_AUTHENTICATED_ACCESS_TYPE

export const CLOUDINARY_RESOURCE_TYPES = {
  IMAGE: 'image',
  RAW: 'raw',
} as const

export type CloudinaryResourceType =
  (typeof CLOUDINARY_RESOURCE_TYPES)[keyof typeof CLOUDINARY_RESOURCE_TYPES]
