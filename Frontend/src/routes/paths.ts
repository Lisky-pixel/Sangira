export const ROUTES = {
  HOME: '/',
  GET_STARTED: '/register',
  GET_STARTED_LEGACY: '/get-started',
  SIGN_IN: '/signin',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  REGISTER_DONOR: '/register?role=donor',
  REGISTER_NGO: '/register?role=ngo',
  REGISTER: '/register',
  REGISTER_DETAILS: '/register/details',
  REGISTER_DOCUMENTS: '/register/documents',
  REGISTER_PENDING: '/register/pending',
  REGISTER_REJECTED: '/register/rejected',
  VERIFICATION_APPROVED: '/verified',
  DONOR_DASHBOARD: '/donor/dashboard',
  /** TEMPORARY — donor portal screens until slices ship */
  DONOR_LISTINGS: '/donor/listings',
  POST_LISTING: '/donor/listings/new',
  DONOR_IMPACT: '/donor/impact',
  DONOR_PROFILE: '/donor/profile',
  DONOR_SETTINGS: '/donor/settings',
  /** TEMPORARY — notifications until slice ships */
  DONOR_NOTIFICATIONS: '/donor/notifications',
  /** TEMPORARY — legacy redirect target */
  DONOR_DASHBOARD_LEGACY: '/portal/donor',
  /** TEMPORARY — NGO portal until dashboard slice ships */
  NGO_DASHBOARD: '/portal/ngo',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  HELP: '/help',
  CONTACT: '/contact',
} as const

export const DONOR_ROUTE_PATTERNS = {
  LISTING_MANAGE: '/donor/listings/:id',
  REQUEST_REVIEW: '/donor/requests/:id',
} as const

export function donorListingManagePath(id: string) {
  return `/donor/listings/${id}`
}

export function donorRequestReviewPath(id: string) {
  return `/donor/requests/${id}`
}

export const LANDING_SECTION_IDS = {
  HOW_IT_WORKS: 'how-it-works',
  IMPACT: 'impact',
  ABOUT: 'about',
} as const

export const LANDING_ANCHORS = {
  HOW_IT_WORKS: `${ROUTES.HOME}#${LANDING_SECTION_IDS.HOW_IT_WORKS}`,
  IMPACT: `${ROUTES.HOME}#${LANDING_SECTION_IDS.IMPACT}`,
  ABOUT: `${ROUTES.HOME}#${LANDING_SECTION_IDS.ABOUT}`,
} as const

export const COMING_SOON_PATHS = [
  ROUTES.PRIVACY,
  ROUTES.TERMS,
  ROUTES.HELP,
  ROUTES.CONTACT,
] as const

/** TEMPORARY — donor portal routes not yet implemented */
export const DONOR_COMING_SOON_PATHS = [
  ROUTES.DONOR_LISTINGS,
  ROUTES.DONOR_IMPACT,
  ROUTES.DONOR_PROFILE,
  ROUTES.DONOR_SETTINGS,
  ROUTES.DONOR_NOTIFICATIONS,
  DONOR_ROUTE_PATTERNS.LISTING_MANAGE,
  DONOR_ROUTE_PATTERNS.REQUEST_REVIEW,
] as const
