import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import {
  ACCEPTED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
  isAcceptedDocumentMime,
} from '../constants/documents.js'
import {
  ACCEPTED_LISTING_PHOTO_TYPES,
  isAcceptedListingPhotoMime,
  LISTING_PHOTO_FIELD,
  MAX_LISTING_PHOTO_SIZE_BYTES,
} from '../constants/listing-photo.js'
import { badRequest } from '../utils/app-error.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Math.max(MAX_DOCUMENT_SIZE_BYTES, MAX_LISTING_PHOTO_SIZE_BYTES),
  },
})

function singleDocumentUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload.single('document')(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(badRequest('File must be under 5 MB', 'DOCUMENT_TOO_LARGE'))
      }
      return next(badRequest(err.message, 'UPLOAD_ERROR'))
    }

    if (err) {
      return next(err)
    }

    return next()
  })
}

export const uploadCertificateMiddleware = singleDocumentUpload

export function requireCertificateFile(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const file = req.file

  if (!file) {
    return next(
      badRequest('Verification document is required', 'DOCUMENT_REQUIRED'),
    )
  }

  if (!isAcceptedDocumentMime(file.mimetype)) {
    return next(
      badRequest(
        `File must be one of: ${ACCEPTED_DOCUMENT_TYPES.join(', ')}`,
        'INVALID_DOCUMENT_TYPE',
      ),
    )
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return next(badRequest('File must be under 5 MB', 'DOCUMENT_TOO_LARGE'))
  }

  return next()
}

function singleListingPhotoUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload.single(LISTING_PHOTO_FIELD)(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          badRequest('Photo must be under 5 MB', 'LISTING_PHOTO_TOO_LARGE'),
        )
      }
      return next(badRequest(err.message, 'UPLOAD_ERROR'))
    }

    if (err) {
      return next(err)
    }

    return next()
  })
}

export const uploadListingPhotoMiddleware = singleListingPhotoUpload

export function requireListingPhoto(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const file = req.file

  if (!file) {
    return next(badRequest('Listing photo is required', 'LISTING_PHOTO_REQUIRED'))
  }

  if (!isAcceptedListingPhotoMime(file.mimetype)) {
    return next(
      badRequest(
        `Photo must be one of: ${ACCEPTED_LISTING_PHOTO_TYPES.join(', ')}`,
        'INVALID_LISTING_PHOTO_TYPE',
      ),
    )
  }

  if (file.size > MAX_LISTING_PHOTO_SIZE_BYTES) {
    return next(
      badRequest('Photo must be under 5 MB', 'LISTING_PHOTO_TOO_LARGE'),
    )
  }

  return next()
}
