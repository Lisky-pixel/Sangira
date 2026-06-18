import { ROUTES } from '../routes/paths'

export const ngoListingDetailContent = {
  backLink: 'Back to browse',
  loading: 'Loading listing…',
  loadError: 'This listing is no longer available.',
  pickup: {
    locationHeading: 'Pickup location',
    openInMapsAria: 'Open pickup location in maps',
    instructionsTitle: 'Pickup instructions',
    // TODO: distance/map slice — show "{distance} away · {area}" label and embedded map here
    distanceMapSlot: null,
  },
  donorCard: {
    verified: 'Verified',
    completedTransfers: (count: number) =>
      count === 1 ? '1 completed transfer' : `${count} completed transfers`,
    memberSince: (monthYear: string) => `Member since ${monthYear}`,
  },
  request: {
    requestFood: 'Request this food',
    requested: 'Requested',
    notifyNote: (organisationName: string) =>
      `${organisationName} will be notified.`,
    alreadyRequestedAria: 'You have already requested this listing',
  },
  confirm: {
    stepLabel: 'Step 2 of 2',
    title: 'Confirm your request',
    summary: (input: {
      quantity: number
      unitLabel: string
      title: string
      organisationName: string
      pickupDeadline: string
    }) =>
      `Request ${input.quantity} ${input.unitLabel} of ${input.title} from ${input.organisationName}? ${input.pickupDeadline}`,
    confirm: 'Confirm request',
    cancel: 'Cancel',
    toast: {
      loading: 'Sending request…',
      success: 'Request sent',
      error: 'Could not send request',
      listingUnavailableAction: 'Back to browse',
    },
    // TODO: route to NGO "My requests" when /ngo/requests ships
    myRequestsRoute: ROUTES.NGO_REQUESTS,
  },
  routes: {
    browse: ROUTES.NGO_BROWSE,
  },
} as const
