import { ADMIN_OVERVIEW_ACTIVITY_TYPE } from '../constants/admin-overview'
import { adminOverviewContent } from '../placeholder/admin-overview-content'
import type { AdminOverviewActivityType } from '../types/admin-overview'

export function getAdminOverviewActivityLabel(
  type: AdminOverviewActivityType,
): string {
  switch (type) {
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.VERIFICATION_APPROVED:
      return adminOverviewContent.activity.labels.verificationApproved
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.VERIFICATION_REJECTED:
      return adminOverviewContent.activity.labels.verificationRejected
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.LISTING_POSTED:
      return adminOverviewContent.activity.labels.listingPosted
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.TRANSFER_COMPLETED:
      return adminOverviewContent.activity.labels.transferCompleted
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.REGISTRATION_PENDING:
      return adminOverviewContent.activity.labels.registrationPending
    case ADMIN_OVERVIEW_ACTIVITY_TYPE.LISTING_EXPIRED_UNMATCHED:
      return adminOverviewContent.activity.labels.listingExpiredUnmatched
    default:
      return adminOverviewContent.activity.labels.listingPosted
  }
}
