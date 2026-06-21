import { ROUTES } from '../routes/paths'

export const donorImpactContent = {
  loading: 'Loading your impact…',
  loadError: 'Could not load your impact data.',
  pageTitle: 'Your impact',
  verifiedSince: (monthYear: string) => `Verified donor since ${monthYear}`,
  verifiedDonor: 'Verified donor',
  stats: {
    meals: {
      value: (count: number) => `${count.toLocaleString()} meals redistributed`,
      delta: (count: number) => `+${count.toLocaleString()} this month`,
    },
    waste: {
      value: (kg: number) => `${kg.toLocaleString()} kg waste prevented`,
      delta: (kg: number) => `+${kg.toLocaleString()} this month`,
    },
    itemsLine: (count: number) =>
      `${count.toLocaleString()} items redistributed`,
    itemsDelta: (count: number) => `+${count.toLocaleString()} items this month`,
    transfers: {
      value: (count: number) =>
        `${count.toLocaleString()} completed transfers`,
      ngosServed: (count: number) =>
        count === 1 ? '1 NGO served' : `${count.toLocaleString()} NGOs served`,
    },
  },
  chart: {
    title: 'Meals per month',
    legend: 'Meals redistributed',
    ariaLabel: 'Bar chart of meals redistributed per month',
  },
  share: {
    title: 'Share your impact with stakeholders',
    description:
      'Generate a summary report of your redistribution activity for your records or stakeholders.',
    downloadPdf: 'Download impact summary (PDF)',
  },
  routes: {
    dashboard: ROUTES.DONOR_DASHBOARD,
  },
} as const
