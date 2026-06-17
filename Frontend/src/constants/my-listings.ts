/** My listings tab identifiers — not the same as raw LISTING_STATUS */
export const MY_LISTINGS_TAB = {
  ACTIVE: 'active',
  AWAITING_PICKUP: 'awaiting_pickup',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
} as const

export type MyListingsTab =
  (typeof MY_LISTINGS_TAB)[keyof typeof MY_LISTINGS_TAB]

export const MY_LISTINGS_TAB_VALUES = Object.values(MY_LISTINGS_TAB) as [
  MyListingsTab,
  ...MyListingsTab[],
]

export const MY_LISTINGS_PAGE_SIZE = 12

/** Active tab page 1 reserves one slot for the post-new-listing tile */
export const MY_LISTINGS_ACTIVE_PAGE_ONE_CARD_LIMIT = 11
