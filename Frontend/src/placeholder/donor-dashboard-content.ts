import { ROUTES } from '../routes/paths'

export const donorDashboardContent = {
  topNav: {
    brand: 'Sangira',
    dashboard: 'Dashboard',
    myListings: 'My listings',
    impact: 'Impact',
    postListing: 'Post listing',
    notificationsAria: 'Notifications',
  },
  avatarMenu: {
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log out',
    roleDonor: 'Donor',
    roleNgo: 'NGO',
  },
  greeting: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    verifiedDonor: 'Verified donor',
  },
  cta: {
    title: 'Post surplus food',
    subtitle: 'Takes under 2 minutes',
  },
  activeListings: {
    heading: 'Active listings',
    viewAll: 'View all',
    manage: 'Manage',
    postedAgo: (hours: number) => `Posted ${hours}h ago`,
    requestCount: (count: number) =>
      count === 1 ? '1 request' : `${count} requests`,
    noRequests: 'No requests yet',
    empty: 'No ongoing listings right now.',
    emptyCta: 'Post surplus food',
    loading: 'Loading your listings…',
    loadError:
      'Unable to load your listings right now. Refresh the page or try again shortly.',
  },
  needsAction: {
    heading: 'Needs your action',
    reviewRequest: 'Review request',
    empty: "You're all caught up.",
    viewAll: (shown: number, total: number) => `${shown} of ${total} · View all`,
    loading: 'Loading pending requests…',
    loadError: 'Could not load pending requests.',
  },
  monthlyImpact: {
    heading: 'Monthly impact',
    meals: (count: number) => `${count.toLocaleString()} meals`,
    wastePrevented: (kg: number) => `${kg.toLocaleString()} kg waste prevented`,
    items: (count: number) => `${count.toLocaleString()} items`,
    loading: 'Loading impact…',
    loadError: 'Could not load impact data.',
  },
  recentActivity: {
    heading: 'Recent activity',
    empty: 'No recent activity yet.',
    viewAll: 'View all',
  },
  activity: {
    listingPosted: {
      title: 'Listing posted',
      description: (listingTitle: string) =>
        `${listingTitle} is now visible to NGOs.`,
    },
    requestReceived: {
      title: (ngoName: string) => `${ngoName} requested your listing`,
      description: (listingTitle: string) =>
        `Review the request for ${listingTitle}.`,
    },
    requestAccepted: {
      title: (ngoName: string) => `${ngoName} accepted for pickup`,
      description: (listingTitle: string) =>
        `${listingTitle} is awaiting pickup.`,
    },
    transferCompleted: {
      title: (ngoName: string) => `${ngoName} pickup`,
      description: (input: {
        listingTitle: string
        meals: number
        wasteKg: number
        items: number
      }) => {
        if (input.meals > 0) {
          return `${input.meals.toLocaleString()} meals collected from ${input.listingTitle}.`
        }
        if (input.items > 0) {
          return `${input.items.toLocaleString()} items collected from ${input.listingTitle}.`
        }
        if (input.wasteKg > 0) {
          return `${input.wasteKg.toLocaleString()} kg collected from ${input.listingTitle}.`
        }
        return `Transfer completed for ${input.listingTitle}.`
      },
    },
    listingExpired: {
      title: 'Listing expired',
      description: (listingTitle: string) =>
        `${listingTitle} was not collected in time.`,
    },
    fallback: {
      title: 'Activity update',
      description: 'Your redistribution activity was updated.',
    },
  },
  needHelp: {
    heading: 'Need help?',
    body: 'Our support team can help with listings, pickups, and verification.',
    contactSupport: 'Contact support',
  },
  statusChip: {
    active: 'Active',
    requested: 'Requested',
  },
  countdownChip: {
    expiresIn: (hours: number, minutes: number) =>
      `Expires in ${hours}h ${minutes}m`,
    expired: 'Expired',
  },
  supportRoute: ROUTES.CONTACT,
} as const
