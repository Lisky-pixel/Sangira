type MyListingsInvalidationListener = () => void

const listeners = new Set<MyListingsInvalidationListener>()

/** Notify mounted listing views to refetch GET /listings/mine (e.g. after create). */
export function invalidateMyListings() {
  listeners.forEach((listener) => listener())
}

export function subscribeMyListingsInvalidation(
  listener: MyListingsInvalidationListener,
) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
