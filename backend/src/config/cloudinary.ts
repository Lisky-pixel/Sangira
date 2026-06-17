import { v2 as cloudinary } from 'cloudinary'
import { config } from './env.js'
import {
  CLOUDINARY_FOLDER,
  DOCUMENT_VIEW_URL_TTL_SECONDS,
  SIGNED_CERTIFICATE_URL_TTL_SECONDS,
} from '../constants/auth.js'
import {
  CLOUDINARY_AUTHENTICATED_ACCESS_TYPE,
  CLOUDINARY_RESOURCE_TYPES,
  type CloudinaryAccessType,
  type CloudinaryResourceType,
} from '../constants/cloudinary.js'
import {
  CLOUDINARY_LISTING_ACCESS_TYPE,
  CLOUDINARY_LISTING_FOLDER,
  CLOUDINARY_LISTING_RESOURCE_TYPE,
} from '../constants/cloudinary-listings.js'

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true,
})

export type CertificateUploadResult = {
  url: string
  publicId: string
  filename: string
  size: number
  resourceType: CloudinaryResourceType
  format: string
  accessType: CloudinaryAccessType
}

function normalizeUploadResourceType(
  resourceType: string | undefined,
): CloudinaryResourceType {
  return resourceType === CLOUDINARY_RESOURCE_TYPES.RAW
    ? CLOUDINARY_RESOURCE_TYPES.RAW
    : CLOUDINARY_RESOURCE_TYPES.IMAGE
}

export async function uploadCertificate(
  buffer: Buffer,
  filename: string,
): Promise<CertificateUploadResult> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        type: CLOUDINARY_AUTHENTICATED_ACCESS_TYPE,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        filename_override: filename,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'))
          return
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          filename,
          size: result.bytes,
          resourceType: normalizeUploadResourceType(result.resource_type),
          format: result.format,
          accessType: CLOUDINARY_AUTHENTICATED_ACCESS_TYPE,
        })
      },
    )

    upload.end(buffer)
  })
}

export type ListingPhotoUploadResult = {
  secureUrl: string
  publicId: string
}

export async function uploadListingPhoto(
  buffer: Buffer,
  filename: string,
): Promise<ListingPhotoUploadResult> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_LISTING_FOLDER,
        type: CLOUDINARY_LISTING_ACCESS_TYPE,
        resource_type: CLOUDINARY_LISTING_RESOURCE_TYPE,
        use_filename: true,
        unique_filename: true,
        filename_override: filename,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary listing upload failed'))
          return
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        })
      },
    )

    upload.end(buffer)
  })
}

export type SignedDocumentViewInput = {
  publicId: string
  resourceType: CloudinaryResourceType
  format?: string
  accessType?: CloudinaryAccessType
}

/** Short-lived signed URL for authenticated Cloudinary assets */
export function getSignedCertificateView(
  document: SignedDocumentViewInput,
  ttlSeconds = DOCUMENT_VIEW_URL_TTL_SECONDS,
): { url: string; expiresAt: string } {
  const expiresAtUnix = Math.floor(Date.now() / 1000) + ttlSeconds
  const accessType = document.accessType ?? CLOUDINARY_AUTHENTICATED_ACCESS_TYPE

  const url =
    document.resourceType === CLOUDINARY_RESOURCE_TYPES.RAW
      ? cloudinary.utils.private_download_url(
          document.publicId,
          document.format ?? 'pdf',
          {
            resource_type: CLOUDINARY_RESOURCE_TYPES.RAW,
            type: accessType,
            expires_at: expiresAtUnix,
          },
        )
      : cloudinary.url(document.publicId, {
          resource_type: CLOUDINARY_RESOURCE_TYPES.IMAGE,
          type: accessType,
          sign_url: true,
          secure: true,
          expires_at: expiresAtUnix,
          ...(document.format ? { format: document.format } : {}),
        })

  return {
    url,
    expiresAt: new Date(expiresAtUnix * 1000).toISOString(),
  }
}

/** Admin document viewing — separate admin-gated route in a later slice */
export function getSignedCertificateUrl(
  document: SignedDocumentViewInput,
  ttlSeconds = SIGNED_CERTIFICATE_URL_TTL_SECONDS,
): string {
  return getSignedCertificateView(document, ttlSeconds).url
}
