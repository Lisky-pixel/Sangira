import type { HandoverCondition } from '../../constants/handover-condition'
import { cn } from '../../lib/utils'
import { transferReceiptContent } from '../../placeholder/transfer-receipt-content'

type ConditionReportChipProps = {
  condition: HandoverCondition
  className?: string
}

const conditionStyles = {
  as_described: 'bg-status-completed text-status-active',
  partial: 'bg-status-amber text-white',
  issue: 'bg-status-rejected-bg text-status-rejected-text',
} as const satisfies Record<HandoverCondition, string>

export function ConditionReportChip({
  condition,
  className,
}: ConditionReportChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        conditionStyles[condition],
        className,
      )}
    >
      {transferReceiptContent.conditionLabels[condition]}
    </span>
  )
}
