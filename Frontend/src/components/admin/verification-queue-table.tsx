import { ChevronRight } from 'lucide-react'
import { VERIFICATION_WAITING_URGENT_HOURS } from '../../constants/admin-verification'
import { VERIFICATION_STATUS } from '../../constants/verification-status'
import {
  formatRelativeTimeCompact,
  getWaitingHours,
} from '../../lib/relative-time'
import { formatSubmittedDate } from '../../lib/format-verification-date'
import { cn } from '../../lib/utils'
import { adminVerificationContent } from '../../placeholder/admin-verification-content'
import type { VerificationListItem } from '../../types/admin-verification'
import { StatusChip } from '../ui/status-chip'
import {
  VerificationOrgIcon,
  VerificationRoleChip,
} from './verification-role-chip'

type VerificationQueueTableProps = {
  items: VerificationListItem[]
  onSelect: (id: string) => void
  selectedId?: string | null
  highlightedIds?: Set<string>
}

function WaitingCell({ item }: { item: VerificationListItem }) {
  const { table } = adminVerificationContent

  if (item.status === VERIFICATION_STATUS.APPROVED) {
    return (
      <StatusChip
        status="verified"
        label={table.statusApproved}
        className="whitespace-nowrap"
      />
    )
  }

  if (item.status === VERIFICATION_STATUS.REJECTED) {
    return (
      <StatusChip
        status="rejected"
        label={table.statusRejected}
        className="whitespace-nowrap"
      />
    )
  }

  if (item.status === VERIFICATION_STATUS.REVOKED) {
    return (
      <StatusChip
        status="rejected"
        label={table.statusRevoked}
        className="whitespace-nowrap"
      />
    )
  }

  const waitingLabel = formatRelativeTimeCompact(item.waitingSince)
  const isUrgent =
    getWaitingHours(item.waitingSince) >= VERIFICATION_WAITING_URGENT_HOURS

  return (
    <span
      className={cn(
        'font-medium',
        isUrgent ? 'text-clay-red' : 'text-body',
      )}
    >
      {waitingLabel}
    </span>
  )
}

export function VerificationQueueTable({
  items,
  onSelect,
  selectedId,
  highlightedIds,
}: VerificationQueueTableProps) {
  const { table } = adminVerificationContent

  return (
    <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-sand/80 text-charcoal">
              <th className="px-4 py-3 font-semibold">{table.organisation}</th>
              <th className="px-4 py-3 font-semibold">{table.role}</th>
              <th className="px-4 py-3 font-semibold">{table.sector}</th>
              <th className="px-4 py-3 font-semibold">{table.submitted}</th>
              <th className="px-4 py-3 font-semibold">{table.waiting}</th>
              <th className="px-4 py-3 font-semibold">
                <span className="sr-only">{table.action}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isSelected = selectedId === item.id
              const isHighlighted = highlightedIds?.has(item.id) ?? false

              return (
                <tr
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect(item.id)
                    }
                  }}
                  aria-label={table.rowAria(item.organisationName)}
                  className={cn(
                    'border-border hover:bg-sand/30 focus-visible:outline-primary cursor-pointer border-t transition-colors duration-700 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2',
                    isSelected && 'bg-mint-card/40',
                    isHighlighted && 'bg-mint-card/70',
                  )}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <VerificationOrgIcon role={item.role} />
                      <span className="text-charcoal font-medium">
                        {item.organisationName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <VerificationRoleChip role={item.role} />
                  </td>
                  <td className="text-body px-4 py-4">{item.sectorLabel}</td>
                  <td className="text-body px-4 py-4">
                    {formatSubmittedDate(item.submittedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <WaitingCell item={item} />
                  </td>
                  <td className="px-4 py-4">
                    <span
                      aria-hidden="true"
                      className="text-body flex size-8 items-center justify-center"
                    >
                      <ChevronRight className="size-4" />
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
