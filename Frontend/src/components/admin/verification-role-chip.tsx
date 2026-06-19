import { Building2, UtensilsCrossed } from 'lucide-react'
import type { UserRole } from '../../constants/registration-roles'
import { cn } from '../../lib/utils'
import { adminVerificationContent } from '../../placeholder/admin-verification-content'

type VerificationRoleChipProps = {
  role: UserRole
  className?: string
}

const roleStyles: Record<
  UserRole,
  { container: string; dot: string; label: string }
> = {
  ngo: {
    container: 'bg-blue-50 text-blue-700',
    dot: 'bg-blue-500',
    label: adminVerificationContent.roleChip.ngo,
  },
  donor: {
    container: 'bg-mint-card text-verified',
    dot: 'bg-verified',
    label: adminVerificationContent.roleChip.donor,
  },
}

export function VerificationRoleChip({
  role,
  className,
}: VerificationRoleChipProps) {
  const styles = roleStyles[role]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
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

export function VerificationOrgIcon({
  role,
  className,
}: {
  role: UserRole
  className?: string
}) {
  const Icon = role === 'ngo' ? Building2 : UtensilsCrossed

  return (
    <span
      aria-hidden="true"
      className={cn(
        'bg-sand text-body flex size-8 shrink-0 items-center justify-center rounded-lg',
        className,
      )}
    >
      <Icon className="size-4" />
    </span>
  )
}
