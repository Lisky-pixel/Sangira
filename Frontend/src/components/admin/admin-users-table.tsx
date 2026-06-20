import { adminUsersContent } from '../../placeholder/admin-users-content'
import type { AdminUserListItem } from '../../types/admin-users'
import { VerifiedBadge } from '../ui/verified-badge'
import { AdminUserStatusChip } from './admin-user-status-chip'
import {
  VerificationOrgIcon,
  VerificationRoleChip,
} from './verification-role-chip'
import { AdminUsersRowMenu } from './admin-users-row-menu'

type AdminUsersTableProps = {
  users: AdminUserListItem[]
  onViewProfile: (id: string) => void
  onFlag: (user: AdminUserListItem) => void
  onUnflag: (user: AdminUserListItem) => void
  onSuspend: (user: AdminUserListItem) => void
  onReactivate: (user: AdminUserListItem) => void
  onRevoke: (user: AdminUserListItem) => void
  onRestore: (user: AdminUserListItem) => void
}

export function AdminUsersTable({
  users,
  onViewProfile,
  onFlag,
  onUnflag,
  onSuspend,
  onReactivate,
  onRevoke,
  onRestore,
}: AdminUsersTableProps) {
  const { table } = adminUsersContent

  return (
    <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-sand/80 text-charcoal">
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.organisation}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.role}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.sector}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.transfers}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.status}
              </th>
              <th className="px-4 py-3">
                <span className="sr-only">{table.actions}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-border hover:bg-sand/20 border-t transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <VerificationOrgIcon role={user.role} />
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-charcoal truncate font-medium">
                        {user.organisationName}
                      </span>
                      {user.verified ? <VerifiedBadge /> : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <VerificationRoleChip role={user.role} />
                </td>
                <td className="text-body px-4 py-4">{user.sectorLabel}</td>
                <td className="text-body px-4 py-4">
                  {table.transfersValue(user.transfersCount)}
                </td>
                <td className="px-4 py-4">
                  <AdminUserStatusChip status={user.listStatus} />
                </td>
                <td className="px-4 py-4">
                  <AdminUsersRowMenu
                    user={user}
                    triggerLabel={table.rowMenuAria(user.organisationName)}
                    onViewProfile={() => onViewProfile(user.id)}
                    onFlag={() => onFlag(user)}
                    onUnflag={() => onUnflag(user)}
                    onSuspend={() => onSuspend(user)}
                    onReactivate={() => onReactivate(user)}
                    onRevoke={() => onRevoke(user)}
                    onRestore={() => onRestore(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
