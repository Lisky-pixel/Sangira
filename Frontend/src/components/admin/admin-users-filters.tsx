import { ChevronDown, Search } from 'lucide-react'
import { cn } from '../../lib/utils'
import { adminUsersContent } from '../../placeholder/admin-users-content'
import {
  ADMIN_USER_LIST_ROLE_FILTER,
  ADMIN_USER_LIST_STATUS_FILTER,
  type AdminUserListRoleFilter,
  type AdminUserListStatusFilter,
} from '../../constants/admin-users'

type AdminUsersFiltersProps = {
  search: string
  role: AdminUserListRoleFilter
  status: AdminUserListStatusFilter
  onSearchChange: (value: string) => void
  onRoleChange: (value: AdminUserListRoleFilter) => void
  onStatusChange: (value: AdminUserListStatusFilter) => void
}

const selectClassName = cn(
  'border-border text-charcoal w-full appearance-none rounded-lg border bg-white py-2.5 pr-10 pl-3 text-sm',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
)

export function AdminUsersFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}: AdminUsersFiltersProps) {
  const { filters, searchPlaceholder, searchAria } = adminUsersContent

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="text-body pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchAria}
          className={cn(
            'border-border text-charcoal placeholder:text-body/50 w-full rounded-lg border bg-white py-2.5 pr-3 pl-10 text-sm',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          )}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-[10rem]">
          <label htmlFor="admin-users-role-filter" className="sr-only">
            {filters.roleLabel}
          </label>
          <select
            id="admin-users-role-filter"
            value={role}
            onChange={(event) =>
              onRoleChange(event.target.value as AdminUserListRoleFilter)
            }
            className={selectClassName}
          >
            <option value={ADMIN_USER_LIST_ROLE_FILTER.ALL}>
              {filters.roleLabel}: {filters.roleOptions.all}
            </option>
            <option value={ADMIN_USER_LIST_ROLE_FILTER.DONOR}>
              {filters.roleLabel}: {filters.roleOptions.donor}
            </option>
            <option value={ADMIN_USER_LIST_ROLE_FILTER.NGO}>
              {filters.roleLabel}: {filters.roleOptions.ngo}
            </option>
          </select>
          <ChevronDown
            aria-hidden="true"
            className="text-body pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
          />
        </div>

        <div className="relative min-w-[10rem]">
          <label htmlFor="admin-users-status-filter" className="sr-only">
            {filters.statusLabel}
          </label>
          <select
            id="admin-users-status-filter"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as AdminUserListStatusFilter)
            }
            className={selectClassName}
          >
            <option value={ADMIN_USER_LIST_STATUS_FILTER.ALL}>
              {filters.statusLabel}: {filters.statusOptions.all}
            </option>
            <option value={ADMIN_USER_LIST_STATUS_FILTER.ACTIVE}>
              {filters.statusLabel}: {filters.statusOptions.active}
            </option>
            <option value={ADMIN_USER_LIST_STATUS_FILTER.FLAGGED}>
              {filters.statusLabel}: {filters.statusOptions.flagged}
            </option>
            <option value={ADMIN_USER_LIST_STATUS_FILTER.SUSPENDED}>
              {filters.statusLabel}: {filters.statusOptions.suspended}
            </option>
            <option value={ADMIN_USER_LIST_STATUS_FILTER.REVOKED}>
              {filters.statusLabel}: {filters.statusOptions.revoked}
            </option>
          </select>
          <ChevronDown
            aria-hidden="true"
            className="text-body pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
          />
        </div>
      </div>
    </div>
  )
}
