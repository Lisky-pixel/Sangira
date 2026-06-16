import { ROLES } from './enums.js'
import {
  CLOUDINARY_RESOURCE_TYPES,
  type CloudinaryResourceType,
} from './cloudinary.js'

export type { CloudinaryResourceType }

export type VerificationDocumentRole = typeof ROLES.DONOR | typeof ROLES.NGO

export const DOCUMENT_FALLBACK_LABELS: Record<
  VerificationDocumentRole,
  string
> = {
  [ROLES.DONOR]: 'Business certificate',
  [ROLES.NGO]: 'Registration certificate',
}

export const GENERIC_UPLOAD_FILENAMES = new Set([
  'blob',
  'document',
  'file',
  'image',
  'upload',
  'download',
])

function extensionFromFilename(filename: string): string {
  const match = filename.match(/(\.[a-z0-9]+)$/i)
  return match ? match[1].toLowerCase() : ''
}

export function extensionFromMime(mimeType: string): string {
  switch (mimeType) {
    case 'application/pdf':
      return '.pdf'
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    default:
      return ''
  }
}

/** Cloudinary format token (no leading dot), e.g. pdf, jpg, png */
export function formatFromFilename(filename: string): string | undefined {
  const extension = extensionFromFilename(filename).slice(1).toLowerCase()

  if (!extension) {
    return undefined
  }

  if (extension === 'jpeg') {
    return 'jpg'
  }

  return extension
}

export function inferResourceTypeFromFilename(
  filename: string,
): CloudinaryResourceType {
  const extension = extensionFromFilename(filename).toLowerCase()

  if (extension === '.pdf') {
    return CLOUDINARY_RESOURCE_TYPES.RAW
  }

  return CLOUDINARY_RESOURCE_TYPES.IMAGE
}

export function isGenericUploadFilename(filename: string): boolean {
  const trimmed = filename.trim()

  if (!trimmed) {
    return true
  }

  const baseName = trimmed.replace(/\.[a-z0-9]+$/i, '').toLowerCase()
  return GENERIC_UPLOAD_FILENAMES.has(baseName)
}

/** Persist a descriptive filename — role-based fallback when the upload name is generic */
export function resolveStoredDocumentFilename(
  originalFilename: string,
  mimeType: string,
  role: VerificationDocumentRole,
): string {
  const trimmed = originalFilename.trim()

  if (trimmed && !isGenericUploadFilename(trimmed)) {
    return trimmed
  }

  const extension =
    extensionFromFilename(trimmed) || extensionFromMime(mimeType)
  const label = DOCUMENT_FALLBACK_LABELS[role]

  return `${label}${extension}`
}
