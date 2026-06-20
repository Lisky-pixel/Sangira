import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { AdminReportsRankedList } from '../../components/admin/admin-reports-ranked-list'
import { VerificationQueuePager } from '../../components/admin/verification-queue-pager'
import { ADMIN_REPORTS_PAGE } from '../../constants/admin-reports'
import { adminReportsContent } from '../../placeholder/admin-reports-content'
import { adminPortalService } from '../../services/admin-portal-service'
import type { AdminReportsRankedOrganisation } from '../../types/admin-reports'

type AdminReportsRankedPageProps = {
  variant: 'donors' | 'ngos'
}

export function AdminReportsRankedPage({ variant }: AdminReportsRankedPageProps) {
  const copy =
    variant === 'donors'
      ? adminReportsContent.rankedDonorsPage
      : adminReportsContent.rankedNgosPage

  const [page, setPage] = useState(1)
  const [items, setItems] = useState<AdminReportsRankedOrganisation[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoadState('loading')

      try {
        const result =
          variant === 'donors'
            ? await adminPortalService.getReportsDonors(
                page,
                ADMIN_REPORTS_PAGE.PAGE_SIZE,
              )
            : await adminPortalService.getReportsNgos(
                page,
                ADMIN_REPORTS_PAGE.PAGE_SIZE,
              )

        if (cancelled) {
          return
        }

        setItems(result.items)
        setTotalItems(result.pagination.totalItems)
        setTotalPages(result.pagination.totalPages)
        setLoadState('ready')
      } catch {
        if (!cancelled) {
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [page, variant])

  const rankOffset = (page - 1) * ADMIN_REPORTS_PAGE.PAGE_SIZE
  const shownCount = items.length

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link
        to={copy.routes.reports}
        className="text-primary inline-flex text-sm font-medium hover:underline"
      >
        {copy.backToReports}
      </Link>

      <section>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {copy.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm">{copy.pageSubtitle}</p>
      </section>

      <section className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        {loadState === 'loading' ? (
          <p className="text-body text-sm">{copy.loading}</p>
        ) : loadState === 'error' ? (
          <p className="text-clay-red text-sm">{copy.loadError}</p>
        ) : items.length === 0 ? (
          <p className="text-body text-sm">{copy.empty}</p>
        ) : (
          <AdminReportsRankedList
            variant={variant}
            items={items}
            rankOffset={rankOffset}
          />
        )}
      </section>

      {loadState === 'ready' && items.length > 0 ? (
        <VerificationQueuePager
          page={page}
          totalPages={totalPages}
          shownCount={shownCount}
          totalItems={totalItems}
          onPageChange={setPage}
          labels={copy.pager}
        />
      ) : null}
    </div>
  )
}
