import { ROUTES } from '../routes/paths'
import { MY_LISTINGS_TAB } from '../constants/my-listings'

export const myListingsContent = {
  pageTitle: 'My listings',
  pageSubtitle: 'Manage your surplus food listings and track donations.',
  tabs: {
    [MY_LISTINGS_TAB.ACTIVE]: 'Active',
    [MY_LISTINGS_TAB.AWAITING_PICKUP]: 'Awaiting pickup',
    [MY_LISTINGS_TAB.COMPLETED]: 'Completed',
    [MY_LISTINGS_TAB.EXPIRED]: 'Expired',
  },
  tabCount: (count: number) => `(${count})`,
  tablistAriaLabel: 'Listing status',
  loading: 'Loading your listings…',
  loadError: 'Unable to load your listings. Please try again.',
  emptyByTab: {
    [MY_LISTINGS_TAB.ACTIVE]:
      'No active listings yet. Post surplus food to get started.',
    [MY_LISTINGS_TAB.AWAITING_PICKUP]: 'No listings awaiting pickup.',
    [MY_LISTINGS_TAB.COMPLETED]: 'No completed listings.',
    [MY_LISTINGS_TAB.EXPIRED]: 'No expired listings.',
  },
  postNewListing: {
    title: 'Post new listing',
    subtitle: 'Share your surplus food with those who need it most.',
    ariaLabel: 'Create a new surplus food listing',
  },
  pager: {
    previous: 'Previous page',
    next: 'Next page',
    page: (page: number) => `Page ${page}`,
    navAriaLabel: 'Listings pagination',
  },
  card: {
    manage: 'Manage',
    postedAgo: (hours: number) => `Posted ${hours}h ago`,
    requestCount: (count: number) =>
      count === 1 ? '1 request' : `${count} requests`,
    noRequests: 'No requests yet',
    pickingUpBy: (ngoName: string, time: string) =>
      `${ngoName} picking up by ${time}`,
    completedAt: (label: string) => `Completed ${label}`,
    // TODO: wire completed timestamp from listing when backend ships
    completedYesterday: 'yesterday',
    expiredAt: (label: string) => `Expired ${label}`,
  },
  statusChip: {
    active: 'Active',
    requested: 'Requested',
    awaitingPickup: 'Awaiting pickup',
    completed: 'Completed',
    expired: 'Expired',
  },
  countdownChip: {
    expiresIn: (hours: number, minutes: number) =>
      `Expires in ${hours}h ${minutes}m`,
    expired: 'Expired',
  },
  routes: {
    postListing: ROUTES.POST_LISTING,
  },
} as const
