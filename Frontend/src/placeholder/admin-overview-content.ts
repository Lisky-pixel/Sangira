import { ROUTES } from '../routes/paths'

export const adminOverviewContent = {
  pageTitle: 'Overview',
  pageSubtitle: 'Platform health at a glance',
  loading: 'Loading overview…',
  loadError: 'Unable to load overview. Please try again.',
  stats: {
    pendingVerifications: {
      label: 'Pending verifications',
      urgent: (count: number) => `! ${count} waiting over 48 h`,
    },
    activeListings: {
      label: 'Active listings',
    },
    transfersThisWeek: {
      label: 'Transfers this week',
      deltaUp: (delta: number) => `↗ +${delta} vs last week`,
      deltaDown: (delta: number) => `↘ ${delta} vs last week`,
      deltaFlat: '→ 0 vs last week',
    },
    registeredOrganisations: {
      label: 'Registered organisations',
      breakdown: (donors: number, ngos: number) =>
        `${donors} donor${donors === 1 ? '' : 's'} · ${ngos} NGO${ngos === 1 ? '' : 's'}`,
    },
  },
  activity: {
    title: 'Recent activity',
    viewAll: 'View all',
    empty: 'No recent platform activity yet.',
    labels: {
      verificationApproved: 'Verification approved',
      verificationRejected: 'Verification rejected',
      listingPosted: 'New listing',
      transferCompleted: 'Transfer completed',
      registrationPending: 'New registration',
      listingExpiredUnmatched: 'Listing expired unmatched',
    },
    awaitingReview: 'awaiting review',
  },
  flags: {
    title: '⚑ Flags',
    empty: 'No issues flagged',
    review: 'Review',
    // TODO: deep-link flags to actionable filtered admin views
  },
  routes: {
    viewAllActivity: ROUTES.ADMIN_ACTIVITY,
  },
} as const
