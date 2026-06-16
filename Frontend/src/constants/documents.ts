export const MAX_DOCUMENT_SIZE_MB = 5
export const MAX_DOCUMENT_SIZE_BYTES = MAX_DOCUMENT_SIZE_MB * 1024 * 1024

export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const

export type AcceptedDocumentType = (typeof ACCEPTED_DOCUMENT_TYPES)[number]

export const ACCEPTED_DOCUMENT_LABEL = 'PDF, JPG or PNG'

export const ACCEPTED_DOCUMENT_ACCEPT = ACCEPTED_DOCUMENT_TYPES.join(',')

export function isAcceptedDocumentType(
  type: string,
): type is AcceptedDocumentType {
  return (ACCEPTED_DOCUMENT_TYPES as readonly string[]).includes(type)
}

export function validateDocumentFile(file: File): 'type' | 'size' | null {
  if (!isAcceptedDocumentType(file.type)) {
    return 'type'
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return 'size'
  }

  return null
}
