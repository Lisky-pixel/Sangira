const CLOUDINARY_HOST = 'res.cloudinary.com'
const UPLOAD_SEGMENT = '/upload/'

/**
 * Inserts f_auto,q_auto,w_{width} into a Cloudinary delivery URL.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function cloudinaryDeliveryUrl(url: string, width: number): string {
  if (!url.includes(CLOUDINARY_HOST) || !url.includes(UPLOAD_SEGMENT)) {
    return url
  }

  const uploadIndex = url.indexOf(UPLOAD_SEGMENT)
  const afterUpload = url.slice(uploadIndex + UPLOAD_SEGMENT.length)
  if (afterUpload.startsWith('f_auto,')) {
    return url
  }

  const transform = `f_auto,q_auto,w_${width}`
  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}${transform}/`)
}
