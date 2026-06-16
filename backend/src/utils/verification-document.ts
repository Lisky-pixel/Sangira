import type {
  CertificateUploadResult,
  SignedDocumentViewInput,
} from '../config/cloudinary.js'
import {
  CLOUDINARY_AUTHENTICATED_ACCESS_TYPE,
  CLOUDINARY_RESOURCE_TYPES,
  type CloudinaryAccessType,
  type CloudinaryResourceType,
} from '../constants/cloudinary.js'
import {
  formatFromFilename,
  inferResourceTypeFromFilename,
} from '../constants/verification-documents.js'

export type VerificationDocumentRecord = {
  url: string
  publicId: string
  resourceType: CloudinaryResourceType
  format: string
  accessType: CloudinaryAccessType
  filename: string
  size: number
  uploadedAt: Date
}

export function buildVerificationDocumentEntry(
  upload: CertificateUploadResult,
  storedFilename: string,
  uploadedAt: Date,
): VerificationDocumentRecord {
  return {
    url: upload.url,
    publicId: upload.publicId,
    resourceType: upload.resourceType,
    format: upload.format,
    accessType: upload.accessType,
    filename: storedFilename,
    size: upload.size,
    uploadedAt,
  }
}

export type StoredVerificationDocumentLike = {
  url: string
  publicId?: string
  resourceType?: CloudinaryResourceType
  format?: string
  accessType?: CloudinaryAccessType
  filename: string
}

/** Parse legacy Cloudinary delivery URLs when metadata fields are missing */
export function parseCloudinaryStoredUrl(url: string): {
  publicId: string
  resourceType: CloudinaryResourceType
  format?: string
} | null {
  try {
    const parsed = new URL(url)
    const resourceType =
      parsed.pathname.includes(`/${CLOUDINARY_RESOURCE_TYPES.RAW}/`)
        ? CLOUDINARY_RESOURCE_TYPES.RAW
        : CLOUDINARY_RESOURCE_TYPES.IMAGE
    const match = parsed.pathname.match(/\/v\d+\/(.+)$/)

    if (!match?.[1]) {
      return null
    }

    const pathWithExt = decodeURIComponent(match[1])
    const formatMatch = pathWithExt.match(/\.([a-z0-9]+)$/i)
    const format = formatMatch?.[1]?.toLowerCase()
    const publicId = formatMatch
      ? pathWithExt.slice(0, -formatMatch[0].length)
      : pathWithExt

    return {
      publicId,
      resourceType,
      format: format === 'jpeg' ? 'jpg' : format,
    }
  } catch {
    return null
  }
}

export function resolveDocumentSigningMetadata(
  document: StoredVerificationDocumentLike,
): SignedDocumentViewInput | null {
  const parsed = parseCloudinaryStoredUrl(document.url)
  const publicId = document.publicId?.trim() || parsed?.publicId

  if (!publicId) {
    return null
  }

  const resourceType =
    document.resourceType ??
    parsed?.resourceType ??
    inferResourceTypeFromFilename(document.filename)

  const format =
    document.format ??
    parsed?.format ??
    formatFromFilename(document.filename)

  return {
    publicId,
    resourceType,
    format,
    accessType: document.accessType ?? CLOUDINARY_AUTHENTICATED_ACCESS_TYPE,
  }
}
