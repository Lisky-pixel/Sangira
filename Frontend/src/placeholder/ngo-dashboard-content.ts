import { ROUTES } from '../routes/paths'
import { TRANSPORT_MODE } from '../constants/transport-mode'
import type { TransportMode } from '../constants/transport-mode'

const transportModeLabels = {
  [TRANSPORT_MODE.VAN]: 'Van',
  [TRANSPORT_MODE.MOTORBIKE]: 'Motorbike',
  [TRANSPORT_MODE.ON_FOOT]: 'On foot',
} as const

export const ngoDashboardContent = {
  greeting: {
    verifiedOrganisation: 'Verified organisation',
  },
  capacity: {
    capacityToday: (meals: number) => `Capacity today: ${meals} meals`,
    transportNotSet: 'Transport: not set',
    transportAvailable: 'Transport: available',
    transportMode: (mode: TransportMode) =>
      `Transport: ${transportModeLabels[mode]}`,
    subcopy:
      'Keep your capacity and transport details current so donors can coordinate with you.',
    edit: 'Edit',
    editAria: 'Edit daily capacity and transport',
    pausedChip: 'Paused',
    // TODO: matching engine consumes capacity settings when matching ships
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
