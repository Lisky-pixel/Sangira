import { SUPPORT_EMAIL } from '../constants/support'

export const TERMS_EFFECTIVE_DATE = 'June 2026' as const

export const TERMS_MODAL_TITLE = 'Sangira — Terms and Conditions' as const

export type TermsSection = {
  heading: string
  body: string
}

export const TERMS_SECTIONS: TermsSection[] = [
  {
    heading: '1. Introduction',
    body: 'Sangira is a verified digital food-redistribution platform connecting verified surplus-food donors (hotels, caterers, supermarkets) with verified humanitarian organisations (NGOs, shelters, orphanages) in Kigali, Rwanda. Sangira facilitates listings, requests, and a confirmed pickup/handover between parties. Sangira does not handle, store, transport, or inspect food itself; it provides the software that connects and records transfers.',
  },
  {
    heading: '2. Eligibility and acceptance',
    body: 'You confirm you are at least 18 and have authority to register and bind your organisation to this Agreement. Accounts represent organisations, not individuals.',
  },
  {
    heading: '3. Verification',
    body: 'All organisations must complete verification (submitting valid registration documents) and be approved before participating. You agree your registration details and documents are accurate and current. Sangira may approve, reject, suspend, or revoke verification at its discretion to protect platform integrity.',
  },
  {
    heading: '4. Permitted use',
    body: 'Donors agree to post accurate listings (food type, quantity, storage, expiry, pickup details) and to present food as described at handover. NGOs agree to request food in good faith within their capacity, arrange pickup, and inspect and confirm what they receive. Both parties complete the dual-confirmation handover honestly. Use Sangira only for lawful food-redistribution purposes.',
  },
  {
    heading: '5. Food safety and responsibility',
    body: 'Donors are responsible for ensuring food they list is safe, handled hygienically, and accurately described at the time of handover. NGOs are responsible for inspecting food on receipt and reporting its condition truthfully via the condition report. Sangira does not handle, prepare, store, or inspect food and is not responsible for food quality, safety, or fitness — it provides the platform that connects parties and records the transfer. Parties are responsible for complying with applicable food-safety laws.',
  },
  {
    heading: '6. User responsibilities',
    body: 'Provide accurate information; keep credentials confidential; do not misuse the platform (no illegal, abusive, fraudulent, or harmful activity; no impersonation, no unauthorised access; no malware or scraping). Organisations are responsible for actions taken under their account.',
  },
  {
    heading: '7. Accountability and records',
    body: "Sangira records transfers, including the dual confirmation (donor and recipient) and the recipient's condition report, as a record of each redistribution. You agree these records may be used for platform integrity, dispute review, and reporting.",
  },
  {
    heading: '8. Privacy and data',
    body: 'Sangira processes account/profile data (organisation name, contact, phone, registration number, address), listing and transfer data, and usage/technical data to operate and secure the service. Sangira uses subprocessors (e.g. Cloudinary for images, an email provider for notifications) under appropriate safeguards. Data is retained as needed to provide the service and meet legal/operational obligations. Reasonable security measures are applied; no system is fully secure.',
  },
  {
    heading: '9. Suspension and termination',
    body: 'Sangira may suspend an account or revoke verification for violations, misuse, inaccurate information, or security/operational reasons. Suspended or revoked organisations can browse but cannot post or request until reinstated/re-verified. You may stop using Sangira at any time; some provisions survive termination.',
  },
  {
    heading: '10. Limitation of liability',
    body: 'Sangira is provided "as is" and "as available" without warranties of any kind. To the maximum extent permitted by law, Sangira is not liable for indirect, incidental, or consequential damages, nor for the quality, safety, or condition of food transferred between parties. Sangira\'s role is limited to facilitating and recording transfers.',
  },
  {
    heading: '11. Changes',
    body: 'Sangira may update these Terms and will adjust the effective date. Continued use after changes constitutes acceptance where permitted by law.',
  },
  {
    heading: '12. Governing law',
    body: 'These Terms are governed by the laws of the Republic of Rwanda. Disputes are subject to the jurisdiction of the courts of Rwanda, except where prohibited.',
  },
  {
    heading: '13. Contact',
    body: `For questions about these Terms: ${SUPPORT_EMAIL}.`,
  },
  {
    heading: '14. Consent',
    body: 'By registering, you acknowledge you have read and understood these Terms and Conditions and agree to be bound by them.',
  },
]

export const termsContent = {
  modalTitle: TERMS_MODAL_TITLE,
  effectiveDateLabel: (date: string) => `Effective date: ${date}`,
  effectiveDate: TERMS_EFFECTIVE_DATE,
  closeLabel: 'Close terms',
  agreementPrefix: 'I agree with the',
  termsLinkLabel: 'Terms & Conditions',
  validationRequired: 'You must accept the Terms and Conditions',
  pageBackLabel: '← Back',
} as const
