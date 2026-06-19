import { useContext } from 'react'
import { DonorNotificationsContext } from '../realtime/donor-notifications-context'

export function useDonorNotifications() {
  const context = useContext(DonorNotificationsContext)

  if (!context) {
    throw new Error(
      'useDonorNotifications must be used within DonorNotificationsProvider',
    )
  }

  return context
}
