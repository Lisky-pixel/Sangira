import {
  FOOD_LABEL,
  FOOD_TYPE,
  STORAGE_CONDITION,
  type FoodLabel,
  type FoodType,
  type StorageCondition,
} from '../constants/listing-form'
import { ROUTES } from '../routes/paths'

export const postListingContent = {
  pageTitle: 'Post surplus food',
  steps: {
    what: 'What',
    safety: 'Safety & timing',
    pickup: 'Pickup',
  },
  sections: {
    what: {
      title: 'What',
      foodType: 'Food type',
      quantity: 'Quantity',
      unit: 'Unit',
      photo: 'Photo upload',
    },
    safety: {
      title: 'Safety & timing',
      availableUntil: 'Available until',
      storage: 'Storage',
      foodLabels: 'Food labels',
      expiryBanner:
        'Listings expire automatically at the time you set.',
    },
    pickup: {
      title: 'Pickup',
      location: 'Pickup location',
      locationPlaceholder: 'e.g. KG 567 St, Kimironko, Kigali',
      instructions: 'Pickup instructions',
      instructionsPlaceholder:
        'Enter gate code, specific entrance, or parking details…',
    },
  },
  presets: {
    todaySixPm: 'Today 6 PM',
    tonightTenPm: 'Tonight 10 PM',
    tomorrowNoon: 'Tomorrow noon',
  },
  foodTypeLabels: {
    [FOOD_TYPE.COOKED_MEALS]: 'Cooked meals',
    [FOOD_TYPE.FRESH_PRODUCE]: 'Fresh produce',
    [FOOD_TYPE.BAKERY]: 'Bakery',
    [FOOD_TYPE.PACKAGED]: 'Packaged',
    [FOOD_TYPE.BEVERAGES]: 'Beverages',
    [FOOD_TYPE.OTHER]: 'Other',
  } satisfies Record<FoodType, string>,
  quantityUnitLabels: {
    servings: 'servings',
    kg: 'kg',
    items: 'items',
  },
  storageLabels: {
    [STORAGE_CONDITION.AMBIENT]: 'Ambient',
    [STORAGE_CONDITION.REFRIGERATED]: 'Refrigerated',
    [STORAGE_CONDITION.HOT_HELD]: 'Hot-held',
  } satisfies Record<StorageCondition, string>,
  foodLabelLabels: {
    [FOOD_LABEL.CONTAINS_ALLERGENS]: 'Contains allergens',
    [FOOD_LABEL.HALAL]: 'Halal',
    [FOOD_LABEL.VEGETARIAN]: 'Vegetarian',
    [FOOD_LABEL.REQUIRES_REHEATING]: 'Requires reheating',
  } satisfies Record<FoodLabel, string>,
  review: {
    heading: 'Review summary',
    item: 'ITEM',
    expires: 'EXPIRES',
    dietary: 'DIETARY',
    pickup: 'PICKUP',
    none: 'None',
  },
  submit: {
    publish: 'Publish listing',
    note: 'Nearby verified NGOs will be notified by email immediately.',
  },
  toast: {
    publishing: 'Publishing listing…',
    success: 'Listing published',
    error: 'Could not publish listing',
  },
  validation: {
    foodTypeRequired: 'Select a food type',
    quantityMin: 'Quantity must be greater than 0',
    quantityUnitRequired: 'Select a unit',
    photoRequired: 'Upload a photo of the food',
    expiresRequired: 'Choose when the listing expires',
    expiresFuture: 'Expiry must be in the future',
    storageRequired: 'Select a storage condition',
    pickupRequired: 'Add a pickup location',
    photoInvalidType: (label: string) => `File must be ${label}`,
    photoTooLarge: (maxMb: number) => `File must be under ${maxMb} MB`,
  },
  photo: {
    dropzonePrompt: 'Drag & drop or click to upload',
    dropzoneHint: (label: string, maxMb: number) =>
      `${label} up to ${maxMb} MB`,
    replace: 'Replace',
    ariaLabel: 'Upload listing photo',
  },
  // TODO: confirm submit destination when My listings ships
  successNavigateTo: ROUTES.DONOR_LISTINGS,
  edit: {
    pageTitle: 'Edit listing',
    backToManage: 'Back to listing',
    submit: 'Save changes',
    note: 'Changes are visible to nearby NGOs immediately.',
    toast: {
      saving: 'Saving changes…',
      success: 'Listing updated',
      error: 'Could not update listing',
    },
    notEditable: 'This listing can no longer be edited.',
  },
} as const
