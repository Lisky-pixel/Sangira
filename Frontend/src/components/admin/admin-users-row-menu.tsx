import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Flag, MoreVertical, Pause, Shield, ShieldCheck, User } from 'lucide-react'
import {
  ADMIN_USER_LIST_STATUS,
} from '../../constants/admin-users'
import { cn } from '../../lib/utils'
import { adminUsersContent } from '../../placeholder/admin-users-content'
import type { AdminUserListItem } from '../../types/admin-users'

type AdminUsersRowMenuProps = {
  user: AdminUserListItem
  triggerLabel: string
  onViewProfile: () => void
  onFlag: () => void
  onUnflag: () => void
  onSuspend: () => void
  onReactivate: () => void
  onRevoke: () => void
  onRestore: () => void
}

const itemClassName =
  'text-charcoal hover:bg-sand flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none'

export function AdminUsersRowMenu({
  user,
  triggerLabel,
  onViewProfile,
  onFlag,
  onUnflag,
  onSuspend,
  onReactivate,
  onRevoke,
  onRestore,
}: AdminUsersRowMenuProps) {
  const { rowMenu } = adminUsersContent
  const isFlagged = user.listStatus === ADMIN_USER_LIST_STATUS.FLAGGED
  const isSuspended = user.listStatus === ADMIN_USER_LIST_STATUS.SUSPENDED
  const isRevoked = user.listStatus === ADMIN_USER_LIST_STATUS.REVOKED
  const canRevoke = user.verified && !isRevoked

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={triggerLabel}
          className={cn(
            'text-body hover:text-charcoal hover:bg-sand flex size-8 items-center justify-center rounded-lg transition-colors',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          )}
        >
          <MoreVertical aria-hidden="true" className="size-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="border-border z-50 min-w-56 rounded-xl border bg-white p-2 shadow-lg"
        >
          <DropdownMenu.Item
            className={itemClassName}
            onSelect={() => onViewProfile()}
          >
            <User aria-hidden="true" className="size-4" />
            {rowMenu.viewProfile}
          </DropdownMenu.Item>

          {isFlagged ? (
            <DropdownMenu.Item
              className={itemClassName}
              onSelect={() => onUnflag()}
            >
              <Flag
                aria-hidden="true"
                className="text-status-pending-text size-4"
              />
              {rowMenu.unflag}
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Item
              className={itemClassName}
              onSelect={() => onFlag()}
            >
              <Flag
                aria-hidden="true"
                className="text-status-pending-text size-4"
              />
              {rowMenu.flag}
            </DropdownMenu.Item>
          )}

          {isSuspended ? (
            <DropdownMenu.Item
              className={itemClassName}
              onSelect={() => onReactivate()}
            >
              <Pause aria-hidden="true" className="size-4" />
              {rowMenu.reactivate}
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Item
              className={itemClassName}
              onSelect={() => onSuspend()}
            >
              <Pause aria-hidden="true" className="size-4" />
              {rowMenu.suspend}
            </DropdownMenu.Item>
          )}

          {isRevoked ? (
            <DropdownMenu.Item
              className={itemClassName}
              onSelect={() => onRestore()}
            >
              <ShieldCheck
                aria-hidden="true"
                className="text-verified size-4"
              />
              {rowMenu.restore}
            </DropdownMenu.Item>
          ) : null}

          {canRevoke ? (
            <>
              <DropdownMenu.Separator className="bg-border my-1 h-px" />
              <DropdownMenu.Item
                className="text-clay-red hover:bg-status-rejected-bg flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none"
                onSelect={() => onRevoke()}
              >
                <Shield aria-hidden="true" className="size-4" />
                {rowMenu.revoke}
              </DropdownMenu.Item>
            </>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
