import {
  CheckCircle,
  List,
  PlusCircle,
  Search,
  TrendingUp,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import type { WhatsNextCopyItem, WhatsNextIconKey } from '../../placeholder/approved-verification-content'
import { approvedVerificationContent } from '../../placeholder/approved-verification-content'

const ICONS: Record<WhatsNextIconKey, LucideIcon> = {
  'trending-up': TrendingUp,
  search: Search,
  truck: Truck,
  'plus-circle': PlusCircle,
  list: List,
  'check-circle': CheckCircle,
}

type WhatsNextListProps = {
  items: WhatsNextCopyItem[]
  className?: string
}

export function WhatsNextList({ items, className }: WhatsNextListProps) {
  return (
    <div className={className}>
      <p className="text-body mb-4 text-xs font-semibold tracking-widest uppercase">
        {approvedVerificationContent.whatsNextLabel}
      </p>
      <ul className="flex flex-col gap-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon]

          return (
            <li key={item.title} className="flex items-start gap-3">
              <div className="bg-sand flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Icon aria-hidden="true" className="text-stat size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-charcoal text-sm font-semibold">{item.title}</p>
                <p className="text-body mt-0.5 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
