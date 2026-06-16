export const pendingVerificationContent = {
  heading: 'Your registration is being reviewed',
  // TODO: confirm final SLA wording with product/legal
  slaLine: (maskedPhone: string) =>
    `Our team is reviewing your documents. Most reviews finish within 2 business days. We'll notify you by SMS at ${maskedPhone}.`,
  statusChipLabel: 'Pending review',
  documentSubmittedFallback: 'Document submitted',
  uploadedPrefix: 'Uploaded',
  contactSupportLabel: 'Contact support',
  signOutLabel: 'Sign out',
} as const
