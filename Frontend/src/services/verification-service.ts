import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'
import type { VerificationStatus } from '../constants/verification-status'

type ResubmitResponse = {
  verificationStatus: VerificationStatus
}

type DocumentViewResponse = {
  url: string
  expiresAt: string
}

export async function resubmitDocument(
  file: File,
): Promise<ResubmitResponse> {
  const formData = new FormData()
  formData.append('document', file)

  const response = await apiClient.post<ApiEnvelope<ResubmitResponse>>(
    '/verification/resubmit',
    formData,
  )

  return unwrapApiResponse(response)
}

export async function viewVerificationDocument(): Promise<void> {
  const response = await apiClient.get<ApiEnvelope<DocumentViewResponse>>(
    '/verification/document/view',
  )
  const { url } = unwrapApiResponse(response)

  window.open(url, '_blank', 'noopener,noreferrer')
}
