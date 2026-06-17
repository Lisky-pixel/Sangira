import {
  MY_LISTINGS_ACTIVE_PAGE_ONE_CARD_LIMIT,
  MY_LISTINGS_PAGE_SIZE,
  MY_LISTINGS_TAB,
  type MyListingsTab,
} from '../constants/my-listings'

export function getTotalPagesForTab(
  totalItems: number,
  tab: MyListingsTab,
): number {
  if (tab === MY_LISTINGS_TAB.ACTIVE) {
    if (totalItems <= MY_LISTINGS_ACTIVE_PAGE_ONE_CARD_LIMIT) {
      return 1
    }

    const remaining = totalItems - MY_LISTINGS_ACTIVE_PAGE_ONE_CARD_LIMIT
    return 1 + Math.ceil(remaining / MY_LISTINGS_PAGE_SIZE)
  }

  if (totalItems === 0) {
    return 1
  }

  return Math.ceil(totalItems / MY_LISTINGS_PAGE_SIZE)
}

export function paginateTabItems<T>(input: {
  items: T[]
  tab: MyListingsTab
  page: number
}): {
  items: T[]
  showPostNewListingTile: boolean
  totalPages: number
} {
  const { items, tab, page } = input
  const totalPages = getTotalPagesForTab(items.length, tab)

  if (tab === MY_LISTINGS_TAB.ACTIVE) {
    if (page === 1) {
      return {
        items: items.slice(0, MY_LISTINGS_ACTIVE_PAGE_ONE_CARD_LIMIT),
        showPostNewListingTile: true,
        totalPages,
      }
    }

    const offset =
      MY_LISTINGS_ACTIVE_PAGE_ONE_CARD_LIMIT +
      (page - 2) * MY_LISTINGS_PAGE_SIZE

    return {
      items: items.slice(offset, offset + MY_LISTINGS_PAGE_SIZE),
      showPostNewListingTile: false,
      totalPages,
    }
  }

  const offset = (page - 1) * MY_LISTINGS_PAGE_SIZE
  return {
    items: items.slice(offset, offset + MY_LISTINGS_PAGE_SIZE),
    showPostNewListingTile: false,
    totalPages,
  }
}
