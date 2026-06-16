import type { UserRole } from '../constants/registration-roles'
import {
  DOCUMENT_FALLBACK_LABELS,
  GENERIC_UPLOAD_FILENAMES,
} from '../constants/pending-verification'

export type VerificationDocumentLike = {
  filename?: string
  url?: string
  uploadedAt?: string | Date
}

function getExtension(filename: string): string {
  const match = filename.match(/(\.[a-z0-9]+)$/i)
  return match ? match[1].toLowerCase() : ''
}

function deriveExtension(doc: VerificationDocumentLike): string {
  const fromFilename = getExtension(doc.filename ?? '')
  if (fromFilename) {
    return fromFilename
  }

  const url = (doc.url ?? '').toLowerCase()

  if (url.includes('.pdf')) return '.pdf'
  if (url.includes('.png')) return '.png'
  if (url.includes('.jpg') || url.includes('.jpeg')) return '.jpg'

  return ''
}

export function isGenericFilename(filename: string): boolean {
  const trimmed = filename.trim()

  if (!trimmed) {
    return true
  }

  const baseName = trimmed.replace(/\.[a-z0-9]+$/i, '').toLowerCase()

  return GENERIC_UPLOAD_FILENAMES.has(baseName)
}

export function displayFilename(
  doc: VerificationDocumentLike,
  role: UserRole,
): string {
  const filename = doc.filename?.trim() ?? ''

  if (filename && !isGenericFilename(filename)) {
    return filename
  }

  const extension = deriveExtension(doc)
  const label = DOCUMENT_FALLBACK_LABELS[role]

  return `${label}${extension}`
}
