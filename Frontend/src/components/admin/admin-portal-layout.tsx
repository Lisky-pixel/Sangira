import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Outlet } from 'react-router'
import { adminPortalContent } from '../../placeholder/admin-portal-content'
import { AdminSidebar } from './admin-sidebar'

export function AdminPortalLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="bg-cream min-h-screen font-sans lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="border-border hidden bg-white lg:block lg:border-r">
        <div className="sticky top-0 h-screen">
          <AdminSidebar />
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="border-border flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden">
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="text-charcoal hover:text-primary rounded-md p-2 transition-colors"
                aria-label={adminPortalContent.nav.menuAria}
              >
                <Menu aria-hidden="true" className="size-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-charcoal/40" />
              <Dialog.Content className="border-border fixed inset-y-0 left-0 z-50 w-[min(100%,17rem)] border-r bg-white shadow-lg focus:outline-none">
                <div className="flex items-center justify-end px-3 py-3">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="text-charcoal hover:text-primary rounded-md p-2 transition-colors"
                      aria-label={adminPortalContent.nav.closeMenuAria}
                    >
                      <X aria-hidden="true" className="size-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <AdminSidebar
                  className="h-[calc(100%-3.5rem)]"
                  onNavigate={() => setMobileOpen(false)}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <span className="text-primary font-display text-lg font-bold">
            {adminPortalContent.lockup.brand}
          </span>
          <span className="bg-sand text-body rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
            {adminPortalContent.lockup.badge}
          </span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
