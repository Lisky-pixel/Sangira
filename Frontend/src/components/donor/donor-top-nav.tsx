import * as Dialog from '@radix-ui/react-dialog'
import { Menu, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { isUserRole } from '../../constants/registration-roles'
import { cn } from '../../lib/utils'
import { donorDashboardContent } from '../../placeholder/donor-dashboard-content'
import { ROUTES } from '../../routes/paths'
import { useAuth } from '../../auth'
import { ParticipantActionLink } from '../participant/participant-action-control'
import { VerifiedBadge } from '../ui/verified-badge'
import { AvatarMenu } from './avatar-menu'
import { DonorNotificationsBell } from './donor-notifications-bell'

type DonorNavItem = {
  label: string
  to: string
}

const navItems: DonorNavItem[] = [
  { label: donorDashboardContent.topNav.dashboard, to: ROUTES.DONOR_DASHBOARD },
  { label: donorDashboardContent.topNav.myListings, to: ROUTES.DONOR_LISTINGS },
  { label: donorDashboardContent.topNav.impact, to: ROUTES.DONOR_IMPACT },
]

function isNavActive(pathname: string, to: string) {
  if (to === ROUTES.DONOR_DASHBOARD) {
    return pathname === ROUTES.DONOR_DASHBOARD
  }
  return pathname.startsWith(to)
}

type DonorTopNavProps = {
  className?: string
}

function NavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string
  onNavigate?: () => void
  className?: string
}) {
  return (
    <ul className={cn('flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-6', className)}>
      {navItems.map((item) => {
        const active = isNavActive(pathname, item.to)
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className={cn(
                'block rounded-md px-2 py-2 text-sm font-medium transition-colors lg:px-0 lg:py-0',
                active
                  ? 'text-primary'
                  : 'text-body hover:text-primary',
              )}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function DonorTopNav({ className }: DonorTopNavProps) {
  const { state } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (state.status !== 'authed') {
    return null
  }

  const organisationName =
    state.user.organisationName?.trim() || donorDashboardContent.topNav.brand
  const role = isUserRole(state.user.role) ? state.user.role : 'donor'
  const avatarUrl =
    typeof state.user.avatarUrl === 'string'
      ? state.user.avatarUrl
      : undefined

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className={cn('border-b border-border bg-white', className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="text-charcoal hover:text-primary lg:hidden"
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="donor-mobile-nav"
              >
                <Menu aria-hidden="true" className="size-6" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden" />
              <Dialog.Content
                id="donor-mobile-nav"
                className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col gap-6 bg-white px-6 py-8 shadow-lg focus:outline-none lg:hidden"
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-charcoal font-display text-lg font-bold">
                    {donorDashboardContent.topNav.brand}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="text-charcoal hover:text-primary"
                      aria-label="Close navigation menu"
                    >
                      <X aria-hidden="true" className="size-6" />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">
                  Donor portal navigation links
                </Dialog.Description>
                <NavLinks pathname={location.pathname} onNavigate={closeMobile} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Link
            to={ROUTES.DONOR_DASHBOARD}
            className="text-primary font-display shrink-0 text-lg font-bold sm:text-xl"
          >
            {donorDashboardContent.topNav.brand}
          </Link>
        </div>

        <nav aria-label="Donor" className="hidden flex-1 justify-center lg:flex">
          <NavLinks pathname={location.pathname} />
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ParticipantActionLink
            to={ROUTES.POST_LISTING}
            className="hidden gap-2 sm:inline-flex"
          >
            {donorDashboardContent.topNav.postListing}
          </ParticipantActionLink>

          <ParticipantActionLink
            to={ROUTES.POST_LISTING}
            className="inline-flex px-3 sm:hidden"
            aria-label={donorDashboardContent.topNav.postListing}
          >
            <Plus aria-hidden="true" className="size-4" />
          </ParticipantActionLink>

          <DonorNotificationsBell />

          <span aria-hidden="true" className="bg-border hidden h-6 w-px sm:block" />

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-charcoal max-w-[9rem] truncate text-sm font-medium">
              {organisationName}
            </span>
            <VerifiedBadge />
          </div>

          <AvatarMenu
            organisationName={organisationName}
            role={role}
            avatarUrl={avatarUrl}
          />
        </div>
      </div>
    </header>
  )
}
