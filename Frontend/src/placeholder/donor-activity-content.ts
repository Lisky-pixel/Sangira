import { ROUTES } from '../routes/paths'

export const donorActivityContent = {
  backToDashboard: '← Back to dashboard',
  pageTitle: 'Activity',
  pageSubtitle: 'Your full activity history.',
  loading: 'Loading activity…',
  loadError: 'Could not load your activity.',
  empty: 'No activity yet.',
  pager: {
    previous: 'Previous page',
    next: 'Next page',
    page: (page: number) => `Page ${page}`,
    navAriaLabel: 'Activity pagination',
  },
  routes: {
    dashboard: ROUTES.DONOR_DASHBOARD,
  },
} as const
