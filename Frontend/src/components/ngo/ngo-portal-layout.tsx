import { Outlet } from 'react-router'
import { AccountEnforcementNotice } from '../participant/account-enforcement-notice'
import { DonorNotificationsProvider } from '../../realtime/donor-notifications-provider'
import { Footer } from '../layout/footer'
import { NgoTopNav } from './ngo-top-nav'

export function NgoPortalLayout() {
  return (
    <DonorNotificationsProvider>
      <div className="bg-cream flex min-h-screen flex-col font-sans">
        <NgoTopNav />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AccountEnforcementNotice />
          <Outlet />
        </main>
        <Footer />
      </div>
    </DonorNotificationsProvider>
  )
}
