import { cn } from '../../lib/utils'
import { myListingsContent } from '../../placeholder/my-listings-content'

type ListingsPagerProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  navAriaLabel?: string
  previousLabel?: string
  nextLabel?: string
  pageLabel?: (page: number) => string
}

function getPageNumbers(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, totalPages, page])
  if (page > 1) pages.add(page - 1)
  if (page < totalPages) pages.add(page + 1)

  return [...pages].sort((a, b) => a - b)
}

export function ListingsPager({
  page,
  totalPages,
  onPageChange,
  className,
  navAriaLabel = myListingsContent.pager.navAriaLabel,
  previousLabel = myListingsContent.pager.previous,
  nextLabel = myListingsContent.pager.next,
  pageLabel = myListingsContent.pager.page,
}: ListingsPagerProps) {
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <nav
      aria-label={navAriaLabel}
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="border-border text-charcoal hover:text-primary rounded-lg border bg-white px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {previousLabel}
      </button>

      {pageNumbers.map((pageNumber, index) => {
        const previous = pageNumbers[index - 1]
        const showEllipsis = previous !== undefined && pageNumber - previous > 1

        return (
          <span key={pageNumber} className="flex items-center gap-2">
            {showEllipsis ? (
              <span aria-hidden="true" className="text-body px-1">
                …
              </span>
            ) : null}
            <button
              type="button"
              aria-current={pageNumber === page ? 'page' : undefined}
              aria-label={pageLabel(pageNumber)}
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                'min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                pageNumber === page
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-charcoal hover:text-primary bg-white',
              )}
            >
              {pageNumber}
            </button>
          </span>
        )
      })}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="border-border text-charcoal hover:text-primary rounded-lg border bg-white px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {nextLabel}
      </button>
    </nav>
  )
}
