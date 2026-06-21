import type { GetTransferReceiptResult } from '../types/transfer-receipt'
import type { ApiEnvelope } from '../types/api'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export const transferReceiptService = {
  async getReceipt(requestId: string): Promise<GetTransferReceiptResult> {
    const response = await apiClient.get<ApiEnvelope<GetTransferReceiptResult>>(
      `/transfers/${requestId}/receipt`,
    )
    return unwrapApiResponse(response)
  },
}
