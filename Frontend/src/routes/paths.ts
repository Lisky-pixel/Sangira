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
  DONOR_CHANGE_PASSWORD: '/donor/profile/change-password',
  DONOR_SETTINGS: '/donor/settings',
  /** TEMPORARY — notifications until slice ships */
  DONOR_NOTIFICATIONS: '/donor/notifications',
  /** TEMPORARY — legacy redirect target */
  DONOR_DASHBOARD_LEGACY: '/portal/donor',
  NGO_DASHBOARD: '/ngo/dashboard',
  NGO_BROWSE: '/ngo/browse',
  /** TEMPORARY — NGO portal screens until slices ship */
  NGO_REQUESTS: '/ngo/requests',
  NGO_CAPACITY: '/ngo/capacity',
  NGO_PROFILE: '/ngo/profile',
  NGO_SETTINGS: '/ngo/settings',
  /** TEMPORARY — notifications until slice ships */
  NGO_NOTIFICATIONS: '/ngo/notifications',
  /** TEMPORARY — legacy redirect target */
  NGO_PORTAL_LEGACY: '/portal/ngo',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  HELP: '/help',
  CONTACT: '/contact',
} as const

export const DONOR_ROUTE_PATTERNS = {
  LISTING_MANAGE: '/donor/listings/:id',
  LISTING_EDIT: '/donor/listings/:id/edit',
  LISTING_HANDOVER: '/donor/listings/:id/handover',
  REQUEST_REVIEW: '/donor/requests/:id',
} as const

export const NGO_ROUTE_PATTERNS = {
  LISTING_DETAIL: '/ngo/listings/:id',
  REQUEST_CONFIRM: '/ngo/requests/:id/confirm',
} as const

export function ngoListingDetailPath(id: string) {
  return `/ngo/listings/${id}`
}

export function ngoRequestConfirmPath(id: string) {
  return `/ngo/requests/${id}/confirm`
}

export function ngoRequestsPath(tab?: string) {
  return tab ? `${ROUTES.NGO_REQUESTS}?tab=${tab}` : ROUTES.NGO_REQUESTS
}

export function donorListingManagePath(id: string) {
  return `/donor/listings/${id}`
}

export function donorListingEditPath(id: string) {
  return `/donor/listings/${id}/edit`
}

export function donorListingHandoverPath(id: string) {
  return `/donor/listings/${id}/handover`
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

/** TEMPORARY — NGO portal routes not yet implemented */
export const NGO_COMING_SOON_PATHS = [
  ROUTES.NGO_DASHBOARD,
  ROUTES.NGO_CAPACITY,
  ROUTES.NGO_PROFILE,
  ROUTES.NGO_SETTINGS,
  ROUTES.NGO_NOTIFICATIONS,
] as const

/** TEMPORARY — donor portal routes not yet implemented */
export const DONOR_COMING_SOON_PATHS = [
  ROUTES.DONOR_IMPACT,
  ROUTES.DONOR_NOTIFICATIONS,
  DONOR_ROUTE_PATTERNS.REQUEST_REVIEW,
] as const
