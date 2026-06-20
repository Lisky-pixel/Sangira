import { ADMIN_USER_ACTION } from '../constants/admin-users'

export const adminUsersContent = {
  pageTitle: 'Users',
  pageSubtitle: 'All verified organisations on the platform.',
  loading: 'Loading users…',
  loadError: 'Could not load users. Please try again.',
  empty: 'No organisations match your search or filters.',
  searchPlaceholder: 'Search by name, phone or registration number',
  searchAria: 'Search organisations',
  filters: {
    roleLabel: 'Role',
    statusLabel: 'Status',
    roleOptions: {
      all: 'All',
      donor: 'Donor',
      ngo: 'NGO',
    },
    statusOptions: {
      all: 'All',
      active: 'Active',
      flagged: 'Flagged',
      suspended: 'Suspended',
      revoked: 'Revoked',
    },
  },
  table: {
    organisation: 'Organisation',
    role: 'Role',
    sector: 'Sector',
    transfers: 'Transfers',
    status: 'Status',
    actions: 'Actions',
    rowMenuAria: (name: string) => `Actions for ${name}`,
    transfersValue: (count: number) => String(count),
  },
  statusChip: {
    active: 'Active',
    flagged: 'Flagged',
    suspended: 'Suspended',
    revoked: 'Revoked',
  },
  pager: {
    showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    previous: 'Previous page',
    next: 'Next page',
    navAriaLabel: 'Users pagination',
  },
  rowMenu: {
    viewProfile: 'View profile',
    flag: 'Flag organisation',
    unflag: 'Unflag organisation',
    suspend: 'Suspend organisation',
    reactivate: 'Reactivate organisation',
    revoke: 'Revoke verification',
    restore: 'Restore verification',
  },
  profilePanel: {
    closeAria: 'Close profile panel',
    loadError: 'Could not load organisation profile.',
    fields: {
      contactPerson: 'Contact person',
      phone: 'Phone',
      email: 'Email',
      registrationNumber: 'Registration number',
      dailyCapacity: 'Daily capacity',
      transport: 'Transport',
      sector: 'Sector',
      location: 'Location',
      transfers: 'Transfers',
      accountStatus: 'Account status',
      verificationStatus: 'Verification status',
    },
    dailyCapacityValue: (meals: number) => `${meals} meals per day`,
    transfersValue: (count: number) => `${count} completed transfer${count === 1 ? '' : 's'}`,
    documentSectionTitle: 'Registration certificate',
    documentLoading: 'Loading document…',
    documentError: 'Could not load the registration document.',
    documentMissing: 'No registration document uploaded.',
    auditSectionTitle: 'Admin activity',
    auditEmpty: 'No admin actions recorded yet.',
    auditEntry: (
      action: string,
      actor: string,
      when: string,
      reason?: string,
    ) =>
      reason
        ? `${action} by ${actor} · ${when} — ${reason}`
        : `${action} by ${actor} · ${when}`,
  },
  flagModal: {
    title: (org: string) => `Flag ${org}`,
    description:
      'Flagging marks the organisation for attention. It does not block them from using Sangira.',
    reasonLabel: 'Reason (optional)',
    reasonPlaceholder: 'e.g. unusual activity pattern',
    submit: 'Flag',
    cancel: 'Cancel',
  },
  suspendModal: {
    title: (org: string) => `Suspend ${org}`,
    description: (org: string) =>
      `${org} will be blocked from posting and requesting food, and will be notified by email.`,
    reasonLabel: 'Reason',
    reasonPlaceholder: 'e.g. repeated policy violations',
    submit: 'Suspend',
    cancel: 'Cancel',
  },
  reactivateModal: {
    title: (org: string) => `Reactivate ${org}`,
    description: (org: string) =>
      `${org} will regain access to posting and requesting food, and will be notified by email.`,
    submit: 'Reactivate',
    cancel: 'Cancel',
  },
  revokeModal: {
    title: (org: string) => `Revoke verification for ${org}`,
    description:
      'This removes their verified status. They can still sign in but cannot post or request food until they resubmit verification.',
    reasonLabel: 'Reason',
    reasonPlaceholder: 'e.g. fraudulent registration document',
    warning: 'This action cannot be undone from the admin panel.',
    submit: 'Revoke verification',
    cancel: 'Cancel',
  },
  restoreModal: {
    title: (org: string) => `Restore verification for ${org}`,
    description: (org: string) =>
      `${org} will be set back to approved status, regain full access, and receive a confirmation email.`,
    submit: 'Restore verification',
    cancel: 'Cancel',
  },
  toast: {
    flagged: (org: string) => `${org} flagged.`,
    unflagged: (org: string) => `${org} unflagged.`,
    suspended: (org: string) => `${org} suspended — notification email sent.`,
    reactivated: (org: string) =>
      `${org} reactivated — notification email sent.`,
    revoked: (org: string) =>
      `${org} verification revoked — notification email sent.`,
    restored: (org: string) =>
      `${org} verification restored — confirmation email sent.`,
    actionError: 'Could not complete this action. Please try again.',
    conflict: (message: string) => message,
  },
  auditActions: {
    [ADMIN_USER_ACTION.FLAG]: 'Flagged',
    [ADMIN_USER_ACTION.UNFLAG]: 'Unflagged',
    [ADMIN_USER_ACTION.SUSPEND]: 'Suspended',
    [ADMIN_USER_ACTION.REACTIVATE]: 'Reactivated',
    [ADMIN_USER_ACTION.REVOKE_VERIFICATION]: 'Verification revoked',
    [ADMIN_USER_ACTION.RESTORE_VERIFICATION]: 'Verification restored',
  },
} as const
