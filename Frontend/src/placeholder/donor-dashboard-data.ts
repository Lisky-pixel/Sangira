/**
 * Swappable donor dashboard data — replace imports with live API services
 * in the listing-backend slice. Typed to real Listing/Request shapes.
 */
import { LISTING_STATUS } from '../constants/listing-status'
import { REQUEST_STATUS } from '../constants/request-status'
import type { Listing } from '../types/listing'
import type { DonorPendingRequest } from '../types/request'

const now = Date.now()

function hoursFromNow(hours: number) {
  return new Date(now + hours * 60 * 60 * 1000).toISOString()
}

function hoursAgo(hours: number) {
  return new Date(now - hours * 60 * 60 * 1000).toISOString()
}

export const donorActiveListings: Listing[] = [
  {
    _id: 'listing-rice-beans',
    donor: 'donor-hotel-inema',
    title: 'Cooked rice & beans — 40 servings',
    description: 'Freshly prepared surplus from breakfast service.',
    servings: 40,
    photos: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    ],
    expiresAt: hoursFromNow(5),
    status: LISTING_STATUS.ACTIVE,
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    requestCount: 1,
  },
  {
    _id: 'listing-vegetables',
    donor: 'donor-hotel-inema',
    title: 'Mixed vegetables — 25 servings',
    description: 'Assorted cooked vegetables, suitable for immediate pickup.',
    servings: 25,
    photos: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    ],
    expiresAt: hoursFromNow(2),
    status: LISTING_STATUS.ACTIVE,
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
    requestCount: 0,
  },
]

export const donorPendingRequests: DonorPendingRequest[] = [
  {
    _id: 'request-st-joseph',
    listing: 'listing-rice-beans',
    ngo: 'ngo-st-joseph',
    status: REQUEST_STATUS.REQUESTED,
    createdAt: hoursAgo(0.25),
    updatedAt: hoursAgo(0.25),
    ngoName: 'St. Joseph Orphanage',
    listingTitle: 'Cooked rice & beans — 40 servings',
    requestedAt: hoursAgo(0.25),
  },
]

export type DonorMonthlyImpact = {
  meals: number
  wasteKgPrevented: number
  trend: number[]
}

export const donorMonthlyImpact: DonorMonthlyImpact = {
  meals: 320,
  wasteKgPrevented: 86,
  trend: [12, 18, 22, 28, 35, 42, 48, 55, 62, 70, 78, 86],
}

export type DonorActivityEvent = {
  id: string
  title: string
  description: string
  timestamp: string
}

export const donorRecentActivity: DonorActivityEvent[] = [
  {
    id: 'activity-pickup-1',
    title: 'St. Joseph Orphanage pickup',
    description: '40 meals collected from your rice & beans listing.',
    timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-expired-1',
    title: 'Listing expired',
    description: 'Bread rolls — 15 servings was not collected in time.',
    timestamp: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-milestone-1',
    title: 'Impact milestone',
    description: 'You reached 300 meals redistributed this month.',
    timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
