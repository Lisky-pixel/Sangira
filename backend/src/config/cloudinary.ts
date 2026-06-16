import { v2 as cloudinary } from 'cloudinary'
import { config } from './env.js'
import {
  CLOUDINARY_FOLDER,
  SIGNED_CERTIFICATE_URL_TTL_SECONDS,
} from '../constants/auth.js'

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
}

export async function uploadCertificate(
  buffer: Buffer,
  filename: string,
): Promise<CertificateUploadResult> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        type: 'authenticated',
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
        })
      },
    )

    upload.end(buffer)
  })
}

/** Short-lived signed URL for admin document viewing — used in a later slice */
export function getSignedCertificateUrl(
  publicId: string,
  ttlSeconds = SIGNED_CERTIFICATE_URL_TTL_SECONDS,
): string {
  return cloudinary.url(publicId, {
    type: 'authenticated',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + ttlSeconds,
  })
}
