import { cn } from '../../lib/utils'
import { adminUsersContent } from '../../placeholder/admin-users-content'
import {
  ADMIN_USER_LIST_STATUS,
  type AdminUserListStatus,
} from '../../constants/admin-users'

type AdminUserStatusChipProps = {
  status: AdminUserListStatus
  className?: string
}

const statusStyles: Record<
  AdminUserListStatus,
  { container: string; dot: string; label: string }
> = {
  [ADMIN_USER_LIST_STATUS.ACTIVE]: {
    container: 'bg-status-completed text-status-active',
    dot: 'bg-status-active',
    label: adminUsersContent.statusChip.active,
  },
  [ADMIN_USER_LIST_STATUS.FLAGGED]: {
    container: 'bg-status-pending-bg text-status-pending-text',
    dot: 'bg-status-pending-dot',
    label: adminUsersContent.statusChip.flagged,
  },
  [ADMIN_USER_LIST_STATUS.SUSPENDED]: {
    container: 'bg-sand text-status-neutral',
    dot: 'bg-status-suspended',
    label: adminUsersContent.statusChip.suspended,
  },
  [ADMIN_USER_LIST_STATUS.REVOKED]: {
    container: 'bg-status-rejected-bg text-status-rejected-text',
    dot: 'bg-status-rejected-dot',
    label: adminUsersContent.statusChip.revoked,
  },
}

export function AdminUserStatusChip({
  status,
  className,
}: AdminUserStatusChipProps) {
  const styles = statusStyles[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        styles.container,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-1.5 shrink-0 rounded-full', styles.dot)}
      />
      {styles.label}
    </span>
  )
}
