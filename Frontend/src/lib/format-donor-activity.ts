import { DONOR_ACTIVITY_TYPE } from '../constants/donor-activity'
import type { DonorActivityEvent } from '../types/donor-impact'
import { donorDashboardContent } from '../placeholder/donor-dashboard-content'

export function formatDonorActivityEvent(event: DonorActivityEvent): {
  title: string
  description: string
} {
  const { payload } = event
  const listingTitle = payload.listingTitle ?? 'your listing'
  const ngoName = payload.ngoName ?? 'An NGO'

  switch (event.type) {
    case DONOR_ACTIVITY_TYPE.LISTING_POSTED:
      return {
        title: donorDashboardContent.activity.listingPosted.title,
        description:
          donorDashboardContent.activity.listingPosted.description(
            listingTitle,
          ),
      }
    case DONOR_ACTIVITY_TYPE.REQUEST_RECEIVED:
      return {
        title: donorDashboardContent.activity.requestReceived.title(ngoName),
        description:
          donorDashboardContent.activity.requestReceived.description(
            listingTitle,
          ),
      }
    case DONOR_ACTIVITY_TYPE.REQUEST_ACCEPTED:
      return {
        title: donorDashboardContent.activity.requestAccepted.title(ngoName),
        description:
          donorDashboardContent.activity.requestAccepted.description(
            listingTitle,
          ),
      }
    case DONOR_ACTIVITY_TYPE.TRANSFER_COMPLETED:
      return {
        title: donorDashboardContent.activity.transferCompleted.title(ngoName),
        description:
          donorDashboardContent.activity.transferCompleted.description({
            listingTitle,
            meals: payload.mealsRedistributed ?? 0,
            wasteKg: payload.wasteKgPrevented ?? 0,
            items: payload.itemsRedistributed ?? 0,
          }),
      }
    case DONOR_ACTIVITY_TYPE.LISTING_EXPIRED:
      return {
        title: donorDashboardContent.activity.listingExpired.title,
        description:
          donorDashboardContent.activity.listingExpired.description(
            listingTitle,
          ),
      }
    default:
      return {
        title: donorDashboardContent.activity.fallback.title,
        description: donorDashboardContent.activity.fallback.description,
      }
  }
}
