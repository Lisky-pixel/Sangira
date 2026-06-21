import { ROUTES } from '../routes/paths'

export const NGO_DECLINED_REASON = {
  ANOTHER_ORGANISATION_ACCEPTED: 'Another organisation was accepted',
} as const

export const NGO_EXPIRED_REASON = {
  LISTING_EXPIRED_UNFULFILLED:
    'Listing expired before the donor accepted a request',
} as const

export const ngoMyRequestsContent = {
  pageTitle: 'My requests',
  pageSubtitle: 'Track your food requests and pickups.',
  loading: 'Loading your requests…',
  loadError: 'Could not load your requests.',
  tablistAriaLabel: 'Request status tabs',
  tabs: {
    pending: 'Pending',
    accepted: 'Accepted',
    completed: 'Completed',
    declined: 'Declined',
    expired: 'Expired',
  },
  tabCount: (count: number) => `(${count})`,
  empty: {
    pending: 'No pending requests. Browse listings to request food.',
    accepted: 'No accepted pickups right now.',
    completed: 'No completed pickups yet.',
    declined: 'No declined requests.',
    expired: 'No expired requests.',
  },
  earlierHeading: 'Earlier',
  status: {
    accepted: 'Accepted',
    pending: 'Pending',
    completed: 'Completed',
    declined: 'Declined',
    expired: 'Expired',
  },
  acceptedCard: {
    pickupLocation: 'Pickup Location',
    openInMaps: 'Open in Google Maps',
    openInMapsAria: 'Open pickup location in Google Maps',
    deadline: 'Deadline',
    confirmation: 'Confirmation',
    confirmationReady: 'Confirmation code ready',
    confirmPickup: 'Confirm pickup',
  },
  pendingCard: {
    awaitingDecision: 'Awaiting donor decision',
    requestedAgo: (relative: string) => `Requested ${relative}`,
  },
  compactRow: {
    completed: (when: string) => `Completed ${when}`,
    declined: (reason: string, when: string) => `${reason} · ${when}`,
    expired: (reason: string, when: string) => `${reason} · ${when}`,
  },
  deadline: {
    pickupByToday: (time: string) => `Pick up by ${time} today`,
    pickupBy: (time: string, dayLabel: string) =>
      `Pick up by ${time} ${dayLabel}`,
  },
  pager: {
    navAriaLabel: 'My requests pagination',
    previous: 'Previous',
    next: 'Next',
    page: (page: number) => `Page ${page}`,
  },
  routes: {
    browse: ROUTES.NGO_BROWSE,
    confirmPickup: (requestId: string) => `/ngo/requests/${requestId}/confirm`,
  },
} as const
