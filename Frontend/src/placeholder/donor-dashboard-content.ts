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
    empty: 'No active listings yet. Post surplus food to get started.',
    loading: 'Loading your listings…',
    loadError:
      'Unable to load your listings right now. Refresh the page or try again shortly.',
  },
  needsAction: {
    heading: 'Needs your action',
    requestedListing: (ngoName: string) => `${ngoName} requested your listing`,
    reviewRequest: 'Review request',
    empty: 'No pending requests right now.',
  },
  monthlyImpact: {
    heading: 'Monthly impact',
    meals: (count: number) => `${count} meals`,
    wastePrevented: (kg: number) => `${kg} kg waste prevented`,
  },
  recentActivity: {
    heading: 'Recent activity',
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
