import { donorDashboardContent } from '../placeholder/donor-dashboard-content'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening'

export function getTimeOfDay(date = new Date()): TimeOfDay {
  const hour = date.getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export function getGreeting(date = new Date()): string {
  const timeOfDay = getTimeOfDay(date)
  const labels = donorDashboardContent.greeting
  switch (timeOfDay) {
    case 'morning':
      return labels.morning
    case 'afternoon':
      return labels.afternoon
    case 'evening':
      return labels.evening
  }
}
