import {
  VERIFICATION_REJECT_REASON,
  VERIFICATION_REJECT_REASON_LABELS,
} from '../constants/verification-reject-reasons'

export const adminVerificationContent = {
  pageTitle: 'Verification queue',
  pageSubtitle: (pending: number, total: number) =>
    `${pending} awaiting review · ${total} total application${total === 1 ? '' : 's'} · pending first`,
  pageSubtitleEmpty: 'No verification applications yet',
  loading: 'Loading verification queue…',
  loadError: 'Could not load the verification queue. Please try again.',
  empty: 'No verification applications to show.',
  table: {
    organisation: 'Organisation',
    role: 'Role',
    sector: 'Sector',
    submitted: 'Submitted',
    waiting: 'Waiting',
    action: 'Action',
    openReviewAria: (name: string) => `Review ${name}`,
    rowAria: (name: string) => `Open review for ${name}`,
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
  },
  roleChip: {
    donor: 'Donor',
    ngo: 'NGO',
  },
  pager: {
    showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    previous: 'Previous page',
    next: 'Next page',
    navAriaLabel: 'Verification queue pagination',
  },
  reviewPanel: {
    closeAria: 'Close review panel',
    submittedLine: (dateTime: string, waiting: string) =>
      `Submitted ${dateTime} · waiting ${waiting}`,
    fields: {
      contactPerson: 'Contact person',
      phone: 'Phone',
      email: 'Email',
      registrationNumber: 'Registration number',
      dailyCapacity: 'Daily capacity',
      transport: 'Transport',
    },
    dailyCapacityValue: (meals: number) => `${meals} meals per day`,
    documentSectionTitle: 'Registration certificate',
    zoomInAria: 'Zoom in',
    zoomOutAria: 'Zoom out',
    documentLoading: 'Loading document…',
    documentError: 'Could not load the registration document.',
    documentMissing: 'No registration document uploaded.',
    duplicateCheck: {
      none: 'No duplicates found — phone and registration number are unique.',
      phoneClash: (org: string) =>
        `Phone number already registered to ${org}.`,
      registrationClash: (org: string) =>
        `Registration number already registered to ${org}.`,
      bothClash: (phoneOrg: string, regOrg: string) =>
        `Phone number matches ${phoneOrg}; registration number matches ${regOrg}.`,
    },
    approve: 'Approve',
    reject: 'Reject',
    footerMicrocopy:
      'Approval sends an EMAIL to the applicant immediately. All decisions are logged with your admin ID.',
    approveConfirm: {
      title: 'Approve application',
      description: (org: string) =>
        `Approve ${org}? The applicant will receive an EMAIL immediately.`,
      confirm: 'Approve',
      cancel: 'Cancel',
    },
    alreadyHandled: 'This application has already been reviewed.',
    loadError: 'Could not load application details.',
    readOnlyTitle: 'Review decision',
    readOnlyApproved: (reviewer: string, reviewedAt: string) =>
      `Approved by ${reviewer} on ${reviewedAt}`,
    readOnlyRejected: (reviewer: string, reviewedAt: string, reason?: string) =>
      reason
        ? `Rejected by ${reviewer} on ${reviewedAt} — ${reason}`
        : `Rejected by ${reviewer} on ${reviewedAt}`,
    reviewedHeader: (reviewedAt: string) => `Reviewed ${reviewedAt}`,
  },
  rejectModal: {
    title: 'Reject application',
    description: (org: string) =>
      `${org} will be notified by EMAIL with the reason you select.`,
    reasonLabel: 'Reason',
    reasonPlaceholder: 'Select a reason',
    detailsLabel: 'Add details (optional)',
    detailsPlaceholder: 'e.g. the document photo is too dark to read',
    submit: 'Reject application',
    cancel: 'Cancel',
    reasonRequired: 'Select a reason before rejecting.',
  },
  toast: {
    approved: (org: string) => `${org} approved — confirmation EMAIL sent.`,
    rejected: (org: string) => `${org} rejected — notification EMAIL sent.`,
    conflict: (message: string) => message,
    approveError: 'Could not approve this application. Please try again.',
    rejectError: 'Could not reject this application. Please try again.',
  },
  reasonOptions: [
    {
      value: VERIFICATION_REJECT_REASON.ILLEGIBLE_DOCUMENT,
      label: VERIFICATION_REJECT_REASON_LABELS.illegible_document,
    },
    {
      value: VERIFICATION_REJECT_REASON.INVALID_REGISTRATION,
      label: VERIFICATION_REJECT_REASON_LABELS.invalid_registration,
    },
    {
      value: VERIFICATION_REJECT_REASON.INCOMPLETE_INFORMATION,
      label: VERIFICATION_REJECT_REASON_LABELS.incomplete_information,
    },
    {
      value: VERIFICATION_REJECT_REASON.DUPLICATE_APPLICATION,
      label: VERIFICATION_REJECT_REASON_LABELS.duplicate_application,
    },
    {
      value: VERIFICATION_REJECT_REASON.OTHER,
      label: VERIFICATION_REJECT_REASON_LABELS.other,
    },
  ],
} as const
