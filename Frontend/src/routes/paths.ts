export const ROUTES = {
  HOME: '/',
  GET_STARTED: '/register',
  GET_STARTED_LEGACY: '/get-started',
  SIGN_IN: '/signin',
  REGISTER_DONOR: '/register?role=donor',
  REGISTER_NGO: '/register?role=ngo',
  REGISTER: '/register',
  REGISTER_DETAILS: '/register/details',
  REGISTER_DOCUMENTS: '/register/documents',
  REGISTER_PENDING: '/register/pending',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  HELP: '/help',
  CONTACT: '/contact',
} as const

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
  ROUTES.SIGN_IN,
  ROUTES.REGISTER_PENDING,
  ROUTES.PRIVACY,
  ROUTES.TERMS,
  ROUTES.HELP,
  ROUTES.CONTACT,
] as const
