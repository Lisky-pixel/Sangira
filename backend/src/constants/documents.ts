export const MAX_DOCUMENT_SIZE_MB = 5
export const MAX_DOCUMENT_SIZE_BYTES = MAX_DOCUMENT_SIZE_MB * 1024 * 1024

export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const

export type AcceptedDocumentType = (typeof ACCEPTED_DOCUMENT_TYPES)[number]

export const ACCEPTED_DOCUMENT_MIME_SET = new Set<string>(
  ACCEPTED_DOCUMENT_TYPES,
)

export function isAcceptedDocumentMime(
  mime: string,
): mime is AcceptedDocumentType {
  return ACCEPTED_DOCUMENT_MIME_SET.has(mime)
}
