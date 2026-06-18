import { Outlet } from 'react-router'
import { Footer } from '../layout/footer'
import { NgoTopNav } from './ngo-top-nav'

export function NgoPortalLayout() {
  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <NgoTopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
