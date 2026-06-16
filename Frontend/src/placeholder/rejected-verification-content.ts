export const rejectedVerificationContent = {
  heading: 'Your registration needs an update',
  subcopy:
    "We couldn't approve your registration with the document provided. Review the reason below and re-submit — we'll prioritise your re-review.",
  statusChipLabel: 'Not approved',
  reasonLabel: 'Reason for rejection',
  // TODO: confirm /auth/me returns verification.reason
  reasonFallback:
    'No specific reason was provided. Please re-submit a clear copy of your document.',
  uploadedPrefix: 'Uploaded',
  documentSubmittedFallback: 'Document submitted',
  resubmitLabel: 'Re-submit document',
  contactSupportLabel: 'Contact support',
  signOutLabel: 'Sign out',
  dropzone: {
    prompt: 'Drag and drop or click to upload',
    hint: (acceptedLabel: string, maxSizeMb: number) =>
      `${acceptedLabel} · max ${maxSizeMb} MB`,
    ariaLabel: 'Upload replacement verification document',
  },
  validation: {
    invalidType: (acceptedLabel: string) => `File must be ${acceptedLabel}`,
    tooLarge: (maxSizeMb: number) => `File must be under ${maxSizeMb} MB`,
  },
  resubmit: {
    loading: 'Re-submitting…',
    success: 'Re-submitted — back in review',
    error: 'Something went wrong, please try again.',
  },
  viewDocumentError: 'Unable to open your document. Please try again.',
} as const
