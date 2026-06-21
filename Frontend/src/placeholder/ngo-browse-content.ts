import {
  FOOD_TYPE,
  STORAGE_CONDITION,
  type FoodType,
  type StorageCondition,
} from '../constants/listing-form'
import { postListingContent } from './post-listing-content'

export const ngoPortalContent = {
  topNav: {
    brand: 'Sangira',
    dashboard: 'Dashboard',
    browse: 'Browse',
    myRequests: 'My requests',
    capacity: 'Capacity',
    verifiedNgo: 'Verified NGO',
    notificationsAria: 'Notifications',
    mobileNavDescription: 'NGO portal navigation links',
    openMenuAria: 'Open navigation menu',
    closeMenuAria: 'Close navigation menu',
    navAria: 'NGO',
  },
  avatarMenu: {
    roleNgo: 'NGO',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log out',
  },
} as const

export const ngoBrowseContent = {
  pageTitle: 'Browse listings',
  pageSubtitle: 'All available surplus food from verified donors.',
  filters: {
    searchLabel: 'Search listings',
    searchPlaceholder: 'Search by food type or donor',
    expiresToday: 'Expires today',
    // TODO: distance/map slice — add "Within 5 km" chip and Map view toggle here
    locationHint:
      'Set your location in your profile to see distances.',
    locationHintLink: 'Profile',
  },
  foodTypeLabels: postListingContent.foodTypeLabels satisfies Record<
    FoodType,
    string
  >,
  storageLabels: postListingContent.storageLabels satisfies Record<
    StorageCondition,
    string
  >,
  filterFoodTypes: [
    FOOD_TYPE.COOKED_MEALS,
    FOOD_TYPE.FRESH_PRODUCE,
    FOOD_TYPE.BAKERY,
    FOOD_TYPE.PACKAGED,
    FOOD_TYPE.BEVERAGES,
    FOOD_TYPE.OTHER,
  ] as const,
  filterStorageConditions: [
    STORAGE_CONDITION.REFRIGERATED,
    STORAGE_CONDITION.AMBIENT,
    STORAGE_CONDITION.HOT_HELD,
  ] as const,
  card: {
    request: 'Request',
    requested: 'Requested',
    verifiedDonor: 'Verified',
    metaLine: (storageLabel: string, distanceAway: string | null) =>
      distanceAway ? `${distanceAway} · ${storageLabel}` : storageLabel,
  },
  loading: 'Loading listings…',
  loadError: 'Could not load listings',
  empty: 'No listings match your filters right now.',
  emptyAvailable: 'No surplus listings are available right now.',
  footnote: 'Donors shown are verified for food safety compliance.',
  pager: {
    previous: 'Previous page',
    next: 'Next page',
    page: (page: number) => `Page ${page}`,
    navAriaLabel: 'Browse listings pagination',
  },
} as const
