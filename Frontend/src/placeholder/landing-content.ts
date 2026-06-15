import { LANDING_SECTION_IDS } from '../routes/paths'

export const landingHeaderContent = {
  brand: 'Sangira',
  navLinks: [
    { label: 'How it works', href: `#${LANDING_SECTION_IDS.HOW_IT_WORKS}` },
    { label: 'Our impact', href: `#${LANDING_SECTION_IDS.IMPACT}` },
    { label: 'About us', href: `#${LANDING_SECTION_IDS.ABOUT}` },
  ],
  getStartedLabel: 'Get started',
  signInLabel: 'Sign in',
} as const

export const landingHeroContent = {
  eyebrow: 'SANGIRA',
  heading: 'No meal should go to waste while someone goes hungry',
  subcopy:
    'Sangira connects verified food donors with trusted recipient organizations in Kigali, creating a reliable chain of food redistribution that prevents waste and feeds communities.',
  donorCta: 'I have surplus food',
  ngoCta: 'I represent an NGO',
} as const

export const landingHowItWorksContent = {
  sectionId: LANDING_SECTION_IDS.HOW_IT_WORKS,
  steps: [
    {
      title: 'Get verified',
      description:
        'Complete a simple registration to join our trusted network.',
      icon: 'shield' as const,
    },
    {
      title: 'Get matched',
      description:
        'Connect with verified donors or organisations in your sector.',
      icon: 'handshake' as const,
    },
    {
      title: 'Confirm pickup',
      description: 'Securely hand over and track every redistribution event.',
      icon: 'qr-code' as const,
    },
  ],
} as const

export const landingTransparencyContent = {
  sectionId: LANDING_SECTION_IDS.ABOUT,
  heading: 'Built for transparency',
  subheading:
    'Sangira provides the infrastructure for a safe, dignity-first food system.',
  features: {
    verifiedNetwork: {
      title: 'Verified network',
      subhead: 'Institutional trust',
      description:
        'Every donor and NGO undergoes a rigorous verification process to ensure food safety standards and accountability at every stage of the journey.',
      accent: 'verified' as const,
    },
    realTimeImpact: {
      title: 'Real-time impact',
      subhead: 'Live tracking',
      description:
        'Track meals redistributed, waste prevented, and verified partners in real time giving communities and stakeholders clear visibility into outcomes.',
      accent: 'stat' as const,
    },
    rapidResponse: {
      title: 'Rapid response',
      subhead: 'Efficient pickup',
      description:
        'Time-critical notifications and coordinated pickup workflows help surplus food move quickly from donor to recipient before it spoils.',
      accent: 'amber' as const,
    },
  },
} as const

export const landingFooterContent = {
  brand: 'Sangira',
  links: [
    { label: 'Privacy policy', key: 'privacy' as const },
    { label: 'Terms of service', key: 'terms' as const },
    { label: 'Help center', key: 'help' as const },
    { label: 'Contact us', key: 'contact' as const },
  ],
  copyright: '© 2026 Sangira Food Redistribution.',
} as const

export const comingSoonContent = {
  heading: 'Coming soon',
  subcopy: 'This page is under construction. Check back shortly.',
  backLabel: 'Back to home',
} as const
