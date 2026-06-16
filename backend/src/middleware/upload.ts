import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import {
  ACCEPTED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
  isAcceptedDocumentMime,
} from '../constants/documents.js'
import { badRequest } from '../utils/app-error.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_DOCUMENT_SIZE_BYTES,
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
