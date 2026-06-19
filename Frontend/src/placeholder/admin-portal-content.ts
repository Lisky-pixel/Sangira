import { ROUTES } from '../routes/paths'

export const adminPortalContent = {
  lockup: {
    brand: 'Sangira',
    badge: 'ADMIN',
  },
  nav: {
    overview: 'Overview',
    verifications: 'Verifications',
    users: 'Users',
    listings: 'Listings',
    reports: 'Reports',
    profile: 'Admin Profile',
    settings: 'Settings',
    menuAria: 'Open admin navigation',
    closeMenuAria: 'Close admin navigation',
    primaryAria: 'Admin primary navigation',
    secondaryAria: 'Admin account navigation',
  },
  identity: {
    roleLabel: 'Administrator',
  },
  pendingBadgeAria: (count: number) =>
    `${count} pending verification application${count === 1 ? '' : 's'}`,
  // TODO: replace ComingSoon routes with real admin feature pages (one slice at a time)
} as const

export const ADMIN_NAV_ROUTES = {
  overview: ROUTES.ADMIN_OVERVIEW,
  verifications: ROUTES.ADMIN_VERIFICATIONS,
  users: ROUTES.ADMIN_USERS,
  listings: ROUTES.ADMIN_LISTINGS,
  reports: ROUTES.ADMIN_REPORTS,
  profile: ROUTES.ADMIN_PROFILE,
  settings: ROUTES.ADMIN_SETTINGS,
} as const
