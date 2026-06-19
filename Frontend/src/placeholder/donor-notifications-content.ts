import { ROUTES } from '../routes/paths'

export const donorNotificationsContent = {
  panelTitle: 'Notifications',
  markAllRead: 'Mark all as read',
  empty: 'No notifications yet.',
  loading: 'Loading notifications…',
  loadError: 'Could not load notifications.',
  bellAria: (unreadCount: number) =>
    unreadCount > 0
      ? `Notifications, ${unreadCount} unread`
      : 'Notifications',
  openPanelAria: 'Open notifications panel',
  closePanelAria: 'Close notifications panel',
  toastNew: (title: string) => title,
  routes: {
    dashboard: ROUTES.DONOR_DASHBOARD,
  },
} as const
