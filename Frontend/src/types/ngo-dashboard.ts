import type { NgoBrowseListing } from './ngo-browse-listing'
import type { NgoMyRequest } from './ngo-my-request'

export type NgoDashboardCapacity = {
  dailyCapacity: number | null
  transportAvailable: boolean
}

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
