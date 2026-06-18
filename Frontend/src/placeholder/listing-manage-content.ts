import { ROUTES } from '../routes/paths'

export const listingManageContent = {
  backLink: 'Back to my listings',
  loading: 'Loading listing…',
  loadError: 'Unable to load this listing.',
  actions: {
    cancelListing: 'Cancel listing',
    editListing: 'Edit listing',
    editDisabledReason:
      "Can't edit a listing that has been requested or is past.",
  },
  pickup: {
    atPrefix: 'Pickup at',
    instructionsPrefix: 'Pickup instructions:',
  },
  map: {
    alt: 'Map showing pickup location',
    placeholderLabel: 'Map preview',
    openInMapsAria: 'Open pickup location in maps',
  },
  cancelModal: {
    title: 'Cancel this listing?',
    description: 'NGOs will no longer see it.',
    confirm: 'Cancel listing',
    dismiss: 'Keep listing',
  },
  cancelToast: {
    loading: 'Cancelling listing…',
    success: 'Listing cancelled',
    error: 'Could not cancel listing',
  },
  requests: {
    heading: (count: number) => `Requests (${count})`,
    accept: 'Accept this NGO',
    footnote:
      'Accepting one request automatically declines the others and notifies them.',
    empty: 'No requests yet.',
    comingSoonToast:
      'NGO requests will be enabled once the recipient portal is live.',
    capacityToday: (meals: number) => `Capacity today: ${meals} meals`,
    distanceAway: (km: number) => `${km} km away`,
    requestedAgo: (minutes: number) =>
      minutes === 1 ? 'Requested 1 min ago' : `Requested ${minutes} mins ago`,
    acceptConfirmTitle: 'Accept this request?',
    acceptConfirmDescription: (ngoName: string, listingTitle: string) =>
      `Accept ${ngoName} for ${listingTitle}? This declines other requests.`,
    acceptConfirm: 'Accept',
    acceptDismiss: 'Cancel',
    acceptToast: {
      loading: 'Accepting request…',
      success: 'Request accepted',
      error: 'Could not accept request',
    },
    loadError: 'Could not load requests',
    loading: 'Loading requests…',
  },
  routes: {
    myListings: ROUTES.DONOR_LISTINGS,
  },
} as const
