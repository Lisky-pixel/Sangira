import type { NgoBrowseListing } from './ngo-browse-listing'
import type { NgoMyRequest } from './ngo-my-request'
import type { NgoCapacitySettings } from './ngo-capacity'

export type NgoDashboardCapacity = NgoCapacitySettings

export type NgoDashboardActiveRequests = {
  requests: NgoMyRequest[]
  total: number
  requestedListingIds: string[]
}

export type NgoDashboardData = {
  capacity: NgoDashboardCapacity
  availableNow: NgoBrowseListing[]
  activeRequests: NgoDashboardActiveRequests
}

export type GetNgoDashboardResult = {
  dashboard: NgoDashboardData
}
