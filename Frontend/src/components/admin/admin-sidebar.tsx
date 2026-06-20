import { LogOut } from 'lucide-react'
import {
  BarChart3,
  LayoutGrid,
  Package,
  Settings,
  ShieldCheck,
  User,
  UserCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../auth'
import { useAdminPendingCount } from '../../hooks/use-admin-pending-count'
import { useAdminLogout } from '../../hooks/use-admin-logout'
import { getOrgInitials } from '../../lib/org-initials'
import { cn } from '../../lib/utils'
import {
  ADMIN_NAV_ROUTES,
  adminPortalContent,
} from '../../placeholder/admin-portal-content'

type AdminNavItem = {
  label: string
  to: string
  icon: LucideIcon
  badgeCount?: number | null
}

function isNavActive(pathname: string, to: string) {
  if (to === ADMIN_NAV_ROUTES.overview) {
    return pathname === ADMIN_NAV_ROUTES.overview
  }
  return pathname.startsWith(to)
}

function AdminLockup({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-primary font-display text-xl font-bold">
        {adminPortalContent.lockup.brand}
      </span>
      <span className="bg-sand text-body rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
        {adminPortalContent.lockup.badge}
      </span>
    </div>
  )
}

function NavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: AdminNavItem
  pathname: string
  onNavigate?: () => void
}) {
  const active = isNavActive(pathname, item.to)
  const Icon = item.icon
  const showBadge =
    typeof item.badgeCount === 'number' && item.badgeCount > 0

  return (
    <li>
      <Link
        to={item.to}
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
          active
            ? 'bg-mint-card text-primary'
            : 'text-body hover:bg-sand/60 hover:text-charcoal',
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon aria-hidden="true" className="size-5 shrink-0" />
        <span className="min-w-0 flex-1">{item.label}</span>
        {showBadge ? (
          <span
            className="bg-status-pending-bg text-status-pending-text min-w-6 rounded-full px-2 py-0.5 text-center text-xs font-semibold"
            aria-label={adminPortalContent.pendingBadgeAria(item.badgeCount!)}
          >
            {item.badgeCount}
          </span>
        ) : null}
      </Link>
    </li>
  )
}

type AdminSidebarProps = {
  onNavigate?: () => void
  className?: string
}

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const { pathname } = useLocation()
  const { state } = useAuth()
  const adminLogout = useAdminLogout()
  const { count } = useAdminPendingCount()

  const displayName =
    state.status === 'authed' && typeof state.user.name === 'string'
      ? state.user.name.trim()
      : adminPortalContent.identity.roleLabel
  const initials = getOrgInitials(displayName)
  const avatarUrl =
    state.status === 'authed' && typeof state.user.avatarUrl === 'string'
      ? state.user.avatarUrl
      : undefined

  const primaryItems: AdminNavItem[] = [
    {
      label: adminPortalContent.nav.overview,
      to: ADMIN_NAV_ROUTES.overview,
      icon: LayoutGrid,
    },
    {
      label: adminPortalContent.nav.verifications,
      to: ADMIN_NAV_ROUTES.verifications,
      icon: ShieldCheck,
      badgeCount: count,
    },
    {
      label: adminPortalContent.nav.users,
      to: ADMIN_NAV_ROUTES.users,
      icon: User,
    },
    {
      label: adminPortalContent.nav.listings,
      to: ADMIN_NAV_ROUTES.listings,
      icon: Package,
    },
    {
      label: adminPortalContent.nav.reports,
      to: ADMIN_NAV_ROUTES.reports,
      icon: BarChart3,
    },
  ]

  const secondaryItems: AdminNavItem[] = [
    {
      label: adminPortalContent.nav.profile,
      to: ADMIN_NAV_ROUTES.profile,
      icon: UserCircle,
    },
    {
      label: adminPortalContent.nav.settings,
      to: ADMIN_NAV_ROUTES.settings,
      icon: Settings,
    },
  ]

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="border-border border-b px-5 py-5">
        <AdminLockup />
      </div>

      <nav
        aria-label={adminPortalContent.nav.primaryAria}
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <ul className="flex flex-col gap-1">
          {primaryItems.map((item) => (
            <NavItem
              key={item.to}
              item={item}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      <div className="border-border mt-auto border-t px-3 py-4">
        <nav aria-label={adminPortalContent.nav.secondaryAria}>
          <ul className="flex flex-col gap-1">
            {secondaryItems.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </nav>

        <div className="border-border mt-4 flex items-center gap-3 rounded-xl border bg-white px-3 py-3">
          <div
            aria-hidden="true"
            className="bg-primary flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-charcoal truncate text-sm font-semibold">
              {displayName}
            </p>
            <p className="text-body truncate text-xs">
              {adminPortalContent.identity.roleLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              void adminLogout()
              onNavigate?.()
            }}
            className="text-body hover:text-clay-red shrink-0 rounded-md p-2 transition-colors"
            aria-label={adminPortalContent.identity.logoutAria}
          >
            <LogOut aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
