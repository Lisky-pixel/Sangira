import { uploadCertificate } from '../config/cloudinary.js'
import { VERIFICATION_STATUS } from '../constants/enums.js'
import { User } from '../models/user.js'
import { conflict, unauthorized, badRequest } from '../utils/app-error.js'

type VerificationSubdoc = {
  status: string
  submittedAt?: Date
  reason?: string
  documents: Array<{
    url: string
    filename: string
    size: number
    uploadedAt: Date
  }>
}

export async function resubmitVerificationDocument(
  userId: string,
  file: Express.Multer.File,
) {
  const user = await User.findById(userId)

  if (!user) {
    throw unauthorized('Authentication required', 'UNAUTHORIZED')
  }

  const verification = (user as { verification?: VerificationSubdoc })
    .verification

  if (!verification || verification.status !== VERIFICATION_STATUS.REJECTED) {
    throw conflict(
      'Verification resubmission is only allowed when status is rejected',
      'INVALID_VERIFICATION_STATUS',
    )
  }

  const upload = await uploadCertificate(file.buffer, file.originalname).catch(
    () => {
      throw badRequest(
        'Failed to upload verification document',
        'DOCUMENT_UPLOAD_FAILED',
      )
    },
  )
  const now = new Date()

  verification.documents.push({
    url: upload.url,
    filename: upload.filename,
    size: upload.size,
    uploadedAt: now,
  })
  verification.status = VERIFICATION_STATUS.PENDING
  verification.submittedAt = now
  verification.reason = undefined

  if ('businessCertificateUrl' in user) {
    ;(user as { businessCertificateUrl?: string }).businessCertificateUrl =
      upload.url
  }

  user.markModified('verification')
  await user.save()

  return { verificationStatus: VERIFICATION_STATUS.PENDING }
}
