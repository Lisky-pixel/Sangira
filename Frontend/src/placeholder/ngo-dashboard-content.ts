import { ROUTES } from '../routes/paths'

export const ngoDashboardContent = {
  greeting: {
    verifiedOrganisation: 'Verified organisation',
  },
  capacity: {
    setCapacityPrompt: 'Set your capacity',
    capacityToday: (meals: number) => `Capacity today: ${meals} meals`,
    transportAvailable: 'Transport: available',
    transportNotAvailable: 'Transport: not available',
    subcopy:
      'Update your needs daily to help donors match with you faster.',
    edit: 'Edit',
    editAria: 'Edit daily capacity and transport',
    // TODO: Capacity page next slice — full edit flow on NGO_CAPACITY
  },
  availableNow: {
    heading: 'Available now',
    subcopy: 'Recent surplus food from verified donors.',
    browseAll: 'Browse all',
    loading: 'Loading available listings…',
    loadError: 'Could not load available listings.',
    empty: 'No surplus listings are available right now.',
    // TODO: distance/matching slice — location-based feed when serviceLocation ships
  },
  activeRequests: {
    heading: 'Your active requests',
    totalPill: (count: number) => `${count} total`,
    viewAll: 'View all requests →',
    loading: 'Loading your requests…',
    loadError: 'Could not load your requests.',
    empty: 'No pending or accepted requests right now.',
  },
  routes: {
    capacity: ROUTES.NGO_CAPACITY,
    browse: ROUTES.NGO_BROWSE,
    requests: ROUTES.NGO_REQUESTS,
  },
} as const
