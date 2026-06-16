import type { UserRole } from '../constants/registration-roles'

export type WhatsNextIconKey =
  | 'trending-up'
  | 'search'
  | 'truck'
  | 'plus-circle'
  | 'list'
  | 'check-circle'

export type WhatsNextCopyItem = {
  icon: WhatsNextIconKey
  title: string
  description: string
}

export const approvedVerificationContent = {
  heading: "You're verified!",
  statusChipLabel: 'Verified',
  whatsNextLabel: "WHAT'S NEXT",
  verifiedOn: (date: string) => `Verified on ${date}.`,
  // TODO: ensure /auth/me returns verification.reviewedAt (set by admin approval)
  verifiedFallback: 'Verified',
  goToDashboardLabel: 'Go to dashboard',
  welcomeByRole: {
    ngo: (organisationName: string) =>
      `Welcome to Sangira, ${organisationName}. Your organisation has been reviewed and approved. You can now browse surplus food, request pickups, and coordinate with verified donors across Kigali.`,
    donor: (organisationName: string) =>
      `Welcome to Sangira, ${organisationName}. Your organisation has been reviewed and approved. You can now post surplus food, manage listings, and coordinate pickups with verified organisations across Kigali.`,
  },
  whatsNextByRole: {
    ngo: [
      {
        icon: 'trending-up',
        title: 'Set your daily capacity',
        description: 'Tell us how much food your shelter can process daily.',
      },
      {
        icon: 'search',
        title: 'Browse matched listings',
        description: 'View real-time surplus availability in your district.',
      },
      {
        icon: 'truck',
        title: 'Request your first pickup',
        description: 'Coordinate logistical details with verified donors.',
      },
    ],
    donor: [
      {
        icon: 'plus-circle',
        title: 'Post your first surplus listing',
        description: 'Share available surplus food with verified organisations.',
      },
      {
        icon: 'list',
        title: 'Manage your listings',
        description: 'Track requests and availability in real time.',
      },
      {
        icon: 'check-circle',
        title: 'Confirm your first pickup',
        description: 'Securely hand over and record every transfer.',
      },
    ],
  } satisfies Record<UserRole, WhatsNextCopyItem[]>,
} as const

export function getApprovedWelcomeMessage(
  role: UserRole,
  organisationName: string,
): string {
  return approvedVerificationContent.welcomeByRole[role](organisationName)
}

export function getWhatsNextItems(role: UserRole): WhatsNextCopyItem[] {
  return approvedVerificationContent.whatsNextByRole[role]
}
