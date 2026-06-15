// Swappable mock data — replace imports with live API services one screen at a time.

export type Listing = {
  id: string
  title: string
  status: 'active' | 'completed' | 'expired'
}

export const placeholderListings: Listing[] = [
  {
    id: 'listing-001',
    title: 'Surplus produce — placeholder',
    status: 'active',
  },
]
