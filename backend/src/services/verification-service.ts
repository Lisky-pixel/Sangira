import mongoose from 'mongoose'
import { getSignedCertificateView, uploadCertificate } from '../config/cloudinary.js'
import { ROLES, VERIFICATION_STATUS } from '../constants/enums.js'
import {
  resolveStoredDocumentFilename,
  type VerificationDocumentRole,
} from '../constants/verification-documents.js'
import { User } from '../models/user.js'
import {
  badRequest,
  conflict,
  notFound,
  unauthorized,
} from '../utils/app-error.js'
import {
  buildVerificationDocumentEntry,
  resolveDocumentSigningMetadata,
  type StoredVerificationDocumentLike,
} from '../utils/verification-document.js'
import { broadcastVerificationNew } from './admin-verification-service.js'

type VerificationSubdoc = {
  status: string
  submittedAt?: Date
  reviewedAt?: Date
  reviewedBy?: mongoose.Types.ObjectId
  reason?: string
  reasonCode?: string
  reasonDetails?: string
  documents: Array<{
    url: string
    publicId?: string
    resourceType?: string
    format?: string
    accessType?: string
    filename: string
    size: number
    uploadedAt: Date
  }>
}

function resolveUserRole(role: string): VerificationDocumentRole {
  if (role === ROLES.NGO) {
    return ROLES.NGO
  }

  return ROLES.DONOR
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
  const storedFilename = resolveStoredDocumentFilename(
    file.originalname,
    file.mimetype,
    resolveUserRole(user.role),
  )

  verification.documents.push(
    buildVerificationDocumentEntry(upload, storedFilename, now),
  )
  verification.status = VERIFICATION_STATUS.PENDING
  verification.submittedAt = now
  verification.reason = undefined
  verification.reasonCode = undefined
  verification.reasonDetails = undefined
  verification.reviewedAt = undefined
  verification.reviewedBy = undefined

  if ('businessCertificateUrl' in user) {
    ;(user as { businessCertificateUrl?: string }).businessCertificateUrl =
      upload.url
  }

  user.markModified('verification')
  await user.save()

  void broadcastVerificationNew(user._id.toString())

  return { verificationStatus: VERIFICATION_STATUS.PENDING }
}

export async function getOwnVerificationDocumentView(userId: string) {
  const user = await User.findById(userId)

  if (!user) {
    throw unauthorized('Authentication required', 'UNAUTHORIZED')
  }

  const verification = (user as { verification?: VerificationSubdoc })
    .verification
  const documents = verification?.documents ?? []
  const latest = documents[documents.length - 1]

  if (!latest) {
    throw notFound('No verification document found', 'DOCUMENT_NOT_FOUND')
  }

  const signingMetadata = resolveDocumentSigningMetadata(
    latest as StoredVerificationDocumentLike,
  )

  if (!signingMetadata) {
    throw notFound('No verification document found', 'DOCUMENT_NOT_FOUND')
  }

  return getSignedCertificateView(signingMetadata)
}
