import { ROUTES } from '../routes/paths'

export const adminReportsContent = {
  pageTitle: 'Reports',
  pageSubtitle: 'Platform impact and performance monitoring.',
  allTimeLabel: 'All-time',
  loading: 'Loading reports…',
  loadError: 'Could not load reports. Please try again.',
  exports: {
    csv: 'Export CSV',
    pdf: 'Export PDF',
    csvAria: 'Export reports as CSV (coming soon)',
    pdfAria: 'Export reports as PDF (coming soon)',
    deferredToast: 'Report exports are coming soon.',
  },
  stats: {
    mealsRedistributed: {
      label: 'Meals redistributed',
      monthOverMonthUp: (percent: number) => `↗ +${percent}% vs last month`,
      monthOverMonthDown: (percent: number) => `↘ ${percent}% vs last month`,
      monthOverMonthFlat: '→ 0% vs last month',
    },
    wastePrevented: {
      label: 'Waste prevented',
      value: (kg: number) => `${kg.toLocaleString()} kg`,
    },
    completedTransfers: {
      label: 'Completed transfers',
    },
    averageMatchTime: {
      label: 'Average match time',
      value: (minutes: number) => `${minutes.toLocaleString()} min`,
      caption: (rollingDays: number) =>
        `from listing posted to request accepted · last ${rollingDays} days`,
      noRecentMatches: 'no recent matches',
      emptyValue: '—',
    },
  },
  charts: {
    mealsByDayOfWeek: {
      title: 'Meals by day of week',
      legend: 'Meals redistributed',
      ariaLabel: 'Bar chart of meals redistributed by day of week',
    },
    listingsByFoodType: {
      title: 'Listings by food type',
      ariaLabel: 'Ranked listings by food type',
      empty: 'No listings yet.',
    },
  },
  lists: {
    topDonors: {
      title: 'Top donors',
      viewAll: 'View all donors',
      viewAllAria: 'View all donors ranked by completed transfers',
      empty: 'No data yet.',
      count: (n: number) =>
        `${n.toLocaleString()} transfer${n === 1 ? '' : 's'}`,
    },
    mostServedNgos: {
      title: 'Most served NGOs',
      viewAll: 'View all beneficiaries',
      viewAllAria: 'View all beneficiaries ranked by completed pickups',
      empty: 'No data yet.',
      count: (n: number) => `${n.toLocaleString()} pickup${n === 1 ? '' : 's'}`,
    },
  },
  rankedDonorsPage: {
    backToReports: '← Back to reports',
    pageTitle: 'Top donors',
    pageSubtitle: 'Ranked by completed transfers',
    loading: 'Loading donor rankings…',
    loadError: 'Could not load donor rankings.',
    empty: 'No completed transfers yet.',
    pager: {
      showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
      previous: 'Previous page',
      next: 'Next page',
      navAriaLabel: 'Top donors pagination',
    },
    routes: {
      reports: ROUTES.ADMIN_REPORTS,
    },
  },
  rankedNgosPage: {
    backToReports: '← Back to reports',
    pageTitle: 'Most served NGOs',
    pageSubtitle: 'Ranked by completed pickups',
    loading: 'Loading NGO rankings…',
    loadError: 'Could not load NGO rankings.',
    empty: 'No completed pickups yet.',
    pager: {
      showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
      previous: 'Previous page',
      next: 'Next page',
      navAriaLabel: 'Most served NGOs pagination',
    },
    routes: {
      reports: ROUTES.ADMIN_REPORTS,
    },
  },
} as const
