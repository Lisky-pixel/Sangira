import { ROUTES } from '../routes/paths'

export const adminActivityContent = {
  backToOverview: '← Back to Overview',
  pageTitle: 'Activity',
  pageSubtitle: 'Full platform activity.',
  loading: 'Loading activity…',
  loadError: 'Could not load platform activity.',
  empty: 'No platform activity yet.',
  pager: {
    previous: 'Previous page',
    next: 'Next page',
    page: (page: number) => `Page ${page}`,
    navAriaLabel: 'Platform activity pagination',
  },
  routes: {
    overview: ROUTES.ADMIN_OVERVIEW,
  },
} as const
