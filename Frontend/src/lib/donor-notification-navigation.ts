import { DONOR_NOTIFICATION_TYPE } from '../constants/notifications'
import {
  donorListingHandoverPath,
  donorListingManagePath,
} from '../routes/paths'
import type { AppNotification } from '../types/notification'

export function resolveDonorNotificationHref(
  notification: AppNotification,
): string | null {
  const listingId = notification.relatedListing?.trim()
  if (!listingId) {
    return null
  }

  switch (notification.type) {
    case DONOR_NOTIFICATION_TYPE.REQUEST_RECEIVED:
      return donorListingManagePath(listingId)
    case DONOR_NOTIFICATION_TYPE.REQUEST_ACCEPTED:
      return donorListingHandoverPath(listingId)
    case DONOR_NOTIFICATION_TYPE.TRANSFER_COMPLETE:
      return donorListingManagePath(listingId)
    default:
      return null
  }
}
