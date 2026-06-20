import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { adminVerificationContent } from '../../placeholder/admin-verification-content'

type VerificationQueuePagerProps = {
  page: number
  totalPages: number
  shownCount: number
  totalItems: number
  onPageChange: (page: number) => void
  className?: string
  labels?: {
    showing: (shown: number, total: number) => string
    previous: string
    next: string
    navAriaLabel: string
  }
}

export function VerificationQueuePager({
  page,
  totalPages,
  shownCount,
  totalItems,
  onPageChange,
  className,
  labels,
}: VerificationQueuePagerProps) {
  const pager = labels ?? adminVerificationContent.pager

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-body text-sm">
        {pager.showing(shownCount, totalItems)}
      </p>

      {totalPages > 1 ? (
        <nav
          aria-label={pager.navAriaLabel}
          className="flex items-center gap-2 self-end sm:self-auto"
        >
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label={pager.previous}
            className="border-border text-charcoal hover:text-primary flex size-9 items-center justify-center rounded-lg border bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label={pager.next}
            className="border-border text-charcoal hover:text-primary flex size-9 items-center justify-center rounded-lg border bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </nav>
      ) : null}
    </div>
  )
}
