import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut, Settings, User } from 'lucide-react'
import { Link } from 'react-router'
import type { UserRole } from '../../constants/registration-roles'
import { cn } from '../../lib/utils'
import { donorDashboardContent } from '../../placeholder/donor-dashboard-content'
import { ngoPortalContent } from '../../placeholder/ngo-browse-content'
import { ROUTES } from '../../routes/paths'
import { useAuth } from '../../auth'
import { AccountAvatar } from '../ui/account-avatar'

type AvatarMenuProps = {
  organisationName: string
  role: UserRole
  avatarUrl?: string
  className?: string
}

function roleLabel(role: UserRole) {
  return role === 'donor'
    ? donorDashboardContent.avatarMenu.roleDonor
    : ngoPortalContent.avatarMenu.roleNgo
}

function profileRoute(role: UserRole) {
  return role === 'ngo' ? ROUTES.NGO_PROFILE : ROUTES.DONOR_PROFILE
}

function settingsRoute(role: UserRole) {
  return role === 'ngo' ? ROUTES.NGO_SETTINGS : ROUTES.DONOR_SETTINGS
}

function menuCopy(role: UserRole) {
  return role === 'ngo' ? ngoPortalContent.avatarMenu : donorDashboardContent.avatarMenu
}

export function AvatarMenu({
  organisationName,
  role,
  avatarUrl,
  className,
}: AvatarMenuProps) {
  const { logout } = useAuth()
  const copy = menuCopy(role)

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            'hover:bg-sand/60 flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            className,
          )}
          aria-label={`${organisationName} account menu`}
        >
          <AccountAvatar
            name={organisationName}
            avatarUrl={avatarUrl}
            size="sm"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="border-border z-50 min-w-56 rounded-xl border bg-white p-2 shadow-lg"
        >
          <div className="flex items-center gap-3 px-2 py-2">
            <AccountAvatar
              name={organisationName}
              avatarUrl={avatarUrl}
              size="md"
            />
            <div className="min-w-0">
              <p className="text-charcoal truncate text-sm font-semibold">
                {organisationName}
              </p>
              <p className="text-body text-xs">{roleLabel(role)}</p>
            </div>
          </div>

          <DropdownMenu.Separator className="bg-border my-1 h-px" />

          <DropdownMenu.Item asChild>
            <Link
              to={profileRoute(role)}
              className="text-charcoal hover:bg-sand flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm outline-none"
            >
              <User aria-hidden="true" className="size-4" />
              {copy.profile}
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              to={settingsRoute(role)}
              className="text-charcoal hover:bg-sand flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm outline-none"
            >
              <Settings aria-hidden="true" className="size-4" />
              {copy.settings}
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="bg-border my-1 h-px" />

          <DropdownMenu.Item
            className="text-clay-red hover:bg-status-rejected-bg flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none"
            onSelect={() => {
              void logout()
            }}
          >
            <LogOut aria-hidden="true" className="size-4" />
            {copy.logout}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
