import { NGO_NOTIFICATION_TYPE } from '../constants/notifications'
import { TRANSFER_RECEIPT_FROM } from '../constants/transfer-receipt'
import { NGO_REQUESTS_TAB } from '../constants/ngo-requests'
import {
  ngoListingDetailPath,
  ngoRequestConfirmPath,
  ngoRequestsPath,
  transferReceiptPath,
} from '../routes/paths'
import type { AppNotification } from '../types/notification'

export function resolveNgoNotificationHref(
  notification: AppNotification,
): string | null {
  switch (notification.type) {
    case NGO_NOTIFICATION_TYPE.REQUEST_ACCEPTED: {
      const requestId = notification.relatedRequest?.trim()
      if (requestId) {
        return ngoRequestConfirmPath(requestId)
      }
      return ngoRequestsPath(NGO_REQUESTS_TAB.ACCEPTED)
    }
    case NGO_NOTIFICATION_TYPE.TRANSFER_COMPLETE: {
      const requestId = notification.relatedRequest?.trim()
      if (requestId) {
        return transferReceiptPath(
          requestId,
          TRANSFER_RECEIPT_FROM.NGO_REQUESTS,
        )
      }
      return ngoRequestsPath(NGO_REQUESTS_TAB.COMPLETED)
    }
    case NGO_NOTIFICATION_TYPE.NEW_LISTING: {
      const listingId = notification.relatedListing?.trim()
      if (!listingId) {
        return null
      }
      return ngoListingDetailPath(listingId)
    }
    default:
      return null
  }
}
