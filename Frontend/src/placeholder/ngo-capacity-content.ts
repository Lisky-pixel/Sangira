import { ROUTES } from '../routes/paths'
import { TRANSPORT_MODE } from '../constants/transport-mode'

export const ngoCapacityContent = {
  pageTitle: 'Your capacity',
  subcopy:
    'Keep these up to date so donors can coordinate pickups with you.',
  dailyCapacity: {
    label: 'Daily intake capacity',
    decreaseAria: 'Decrease daily capacity',
    increaseAria: 'Increase daily capacity',
    inputAria: 'Daily intake capacity in meals',
  },
  transport: {
    sectionLabel: 'Transport',
    ownTransportLabel: 'We have our own transport',
    modeLabels: {
      [TRANSPORT_MODE.VAN]: 'Van',
      [TRANSPORT_MODE.MOTORBIKE]: 'Motorbike',
      [TRANSPORT_MODE.ON_FOOT]: 'On foot',
    } as const,
    modeAria: (label: string) => `Select ${label} as transport mode`,
  },
  pickupHours: {
    sectionLabel: 'Pickup hours',
    fromLabel: 'From',
    toLabel: 'To',
    invalidRange: 'Start time must be before end time.',
  },
  pause: {
    sectionLabel: 'Pause availability',
    description:
      "Turn this on when you can't receive food right now. Your existing accepted pickups are not affected.",
  },
  save: {
    label: 'Save changes',
    footnote: 'Changes take effect immediately.',
    loading: 'Saving capacity…',
    success: 'Capacity updated.',
    error: 'Could not save capacity. Try again.',
  },
  load: {
    loading: 'Loading your capacity…',
    error: 'Could not load your capacity. Refresh the page and try again.',
  },
  validation: {
    dailyCapacityMin: 'Daily intake capacity must be zero or greater.',
    dailyCapacityMax: 'Daily intake capacity exceeds the allowed maximum.',
    pickupTimeFormat: 'Enter a valid time.',
    transportModeRequired:
      'Choose a transport mode when own transport is enabled.',
    pickupRange: 'Start time must be before end time.',
  },
  routes: {
    dashboard: ROUTES.NGO_DASHBOARD,
  },
  // TODO: matching engine consumes capacity, transport, pickup hours, and paused later
} as const
