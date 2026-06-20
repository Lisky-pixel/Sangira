import {
  ADMIN_LISTING_STATUS_FILTER,
  type AdminListingStatusFilter,
} from '../constants/admin-listings'
import { ROUTES } from '../routes/paths'

export const adminListingsContent = {
  pageTitle: 'Listings',
  pageSubtitle: 'All listings across the platform.',
  loading: 'Loading listings…',
  loadError: 'Could not load listings. Please try again.',
  empty: (status: AdminListingStatusFilter) => {
    switch (status) {
      case ADMIN_LISTING_STATUS_FILTER.ACTIVE:
        return 'No active listings.'
      case ADMIN_LISTING_STATUS_FILTER.AWAITING_PICKUP:
        return 'No listings awaiting pickup.'
      case ADMIN_LISTING_STATUS_FILTER.COMPLETED:
        return 'No completed listings.'
      case ADMIN_LISTING_STATUS_FILTER.EXPIRED:
        return 'No expired listings.'
      default:
        return 'No listings to show.'
    }
  },
  tabs: {
    ariaLabel: 'Filter listings by status',
    all: 'All',
    active: 'Active',
    awaitingPickup: 'Awaiting pickup',
    completed: 'Completed',
    expired: 'Expired',
    label: (name: string, count: number) => `${name} (${count})`,
  },
  insightBanner: {
    title: (count: number) =>
      `${count} listing${count === 1 ? '' : 's'} expired unmatched this month`,
    subcopy: 'Consider reviewing NGO coverage.',
    viewReport: 'View report',
    viewReportAria: 'View reports (coming soon)',
  },
  table: {
    listing: 'Listing',
    donor: 'Donor',
    quantity: 'Quantity',
    posted: 'Posted',
    expires: 'Expires',
    status: 'Status',
    requests: 'Requests',
    expiresDash: '—',
    statusActive: 'Active',
    statusAwaitingPickup: 'Awaiting pickup',
    statusCompleted: 'Completed',
    statusExpired: 'Expired',
  },
  pager: {
    showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    previous: 'Previous page',
    next: 'Next page',
    navAriaLabel: 'Listings pagination',
  },
  reportsPath: ROUTES.ADMIN_REPORTS,
} as const
