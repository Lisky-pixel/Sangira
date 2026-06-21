import {
  TRANSFER_RECEIPT_FROM,
  TRANSFER_RECEIPT_FROM_VALUES,
  type TransferReceiptFrom,
} from '../constants/transfer-receipt'
import { transferReceiptContent } from '../placeholder/transfer-receipt-content'

export function parseTransferReceiptFrom(
  value: string | null,
): TransferReceiptFrom | null {
  if (!value) {
    return null
  }

  return TRANSFER_RECEIPT_FROM_VALUES.includes(value as TransferReceiptFrom)
    ? (value as TransferReceiptFrom)
    : null
}

export function resolveTransferReceiptBackHref(
  from: TransferReceiptFrom | null,
  role: string,
): string {
  if (from && from in transferReceiptContent.backTargets) {
    return transferReceiptContent.backTargets[from]
  }

  return transferReceiptContent.defaultBackForRole(role)
}

export { TRANSFER_RECEIPT_FROM }
