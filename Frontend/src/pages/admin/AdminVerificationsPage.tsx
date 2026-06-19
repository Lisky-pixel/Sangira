import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ADMIN_VERIFICATION_PAGE,
  VERIFICATION_ROW_HIGHLIGHT_MS,
} from '../../constants/admin-verification'
import {
  applyVerificationUpdateToListItem,
  insertVerificationNewItem,
  sortVerificationQueueItems,
  verificationDetailToListItem,
} from '../../lib/sort-verification-queue'
import {
  markVerificationUpdateAppliedFromDetail,
  shouldApplyVerificationNew,
  shouldApplyVerificationUpdate,
} from '../../lib/verification-event-dedupe'
import { useAdminVerification } from '../../realtime/admin-verification-context'
import { adminVerificationContent } from '../../placeholder/admin-verification-content'
import { adminPortalService } from '../../services/admin-portal-service'
import type { VerificationDetail, VerificationListItem } from '../../types/admin-verification'
import { VerificationQueuePager } from '../../components/admin/verification-queue-pager'
import { VerificationQueueTable } from '../../components/admin/verification-queue-table'
import { VerificationReviewPanel } from '../../components/admin/verification-review-panel'

function addRowHighlight(
  current: Set<string>,
  applicationId: string,
): Set<string> {
  const next = new Set(current)
  next.add(applicationId)
  return next
}

export function AdminVerificationsPage() {
  const {
    pendingCount,
    subscribeVerificationUpdated,
    subscribeVerificationNew,
    refreshPendingCount,
  } = useAdminVerification()

  const [page, setPage] = useState(1)
  const [items, setItems] = useState<VerificationListItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(
    () => new Set(),
  )

  const highlightTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  )

  const flashRow = useCallback((applicationId: string) => {
    setHighlightedIds((current) => addRowHighlight(current, applicationId))

    const existing = highlightTimersRef.current.get(applicationId)
    if (existing) {
      clearTimeout(existing)
    }

    const timer = setTimeout(() => {
      setHighlightedIds((current) => {
        const next = new Set(current)
        next.delete(applicationId)
        return next
      })
      highlightTimersRef.current.delete(applicationId)
    }, VERIFICATION_ROW_HIGHLIGHT_MS)

    highlightTimersRef.current.set(applicationId, timer)
  }, [])

  useEffect(() => {
    const timers = highlightTimersRef.current

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoadState('loading')
      try {
        const result = await adminPortalService.listVerifications(
          page,
          ADMIN_VERIFICATION_PAGE.PAGE_SIZE,
        )
        if (cancelled) return
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
  }, [page])

  useEffect(() => {
    return subscribeVerificationUpdated((payload) => {
      if (!shouldApplyVerificationUpdate(payload)) {
        return
      }

      setItems((current) => {
        const hasRow = current.some((item) => item.id === payload.id)
        if (!hasRow) {
          return current
        }

        return sortVerificationQueueItems(
          current.map((item) =>
            applyVerificationUpdateToListItem(item, payload),
          ),
        )
      })
      flashRow(payload.id)
    })
  }, [subscribeVerificationUpdated, flashRow])

  useEffect(() => {
    return subscribeVerificationNew((payload) => {
      if (!shouldApplyVerificationNew(payload)) {
        return
      }

      setTotalItems((current) => {
        const nextTotal = current + 1
        setTotalPages(
          Math.max(1, Math.ceil(nextTotal / ADMIN_VERIFICATION_PAGE.PAGE_SIZE)),
        )
        return nextTotal
      })

      if (page !== 1) {
        return
      }

      setItems((current) => {
        const next = insertVerificationNewItem(current, payload.item)
        if (next.length > ADMIN_VERIFICATION_PAGE.PAGE_SIZE) {
          return next.slice(0, ADMIN_VERIFICATION_PAGE.PAGE_SIZE)
        }
        return next
      })
      flashRow(payload.item.id)
    })
  }, [subscribeVerificationNew, flashRow, page])

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setPanelOpen(true)
  }

  const handleDecision = (detail: VerificationDetail) => {
    markVerificationUpdateAppliedFromDetail(detail)

    setItems((current) => {
      const hasRow = current.some((item) => item.id === detail.id)
      if (!hasRow) {
        return current
      }

      return sortVerificationQueueItems(
        current.map((item) =>
          item.id === detail.id ? verificationDetailToListItem(detail) : item,
        ),
      )
    })
    flashRow(detail.id)
    setSelectedId(null)
    setPanelOpen(false)
    void refreshPendingCount()
  }

  const pendingDisplay =
    typeof pendingCount === 'number' ? pendingCount : 0

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {adminVerificationContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm">
          {totalItems > 0
            ? adminVerificationContent.pageSubtitle(
                pendingDisplay,
                totalItems,
              )
            : adminVerificationContent.pageSubtitleEmpty}
        </p>
      </header>

      {loadState === 'loading' ? (
        <p className="text-body text-sm">{adminVerificationContent.loading}</p>
      ) : loadState === 'error' ? (
        <p className="text-clay-red text-sm">
          {adminVerificationContent.loadError}
        </p>
      ) : totalItems === 0 ? (
        <div className="border-border rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-body text-sm">{adminVerificationContent.empty}</p>
        </div>
      ) : (
        <>
          <VerificationQueueTable
            items={items}
            onSelect={handleSelect}
            selectedId={selectedId}
            highlightedIds={highlightedIds}
          />
          <VerificationQueuePager
            page={page}
            totalPages={totalPages}
            shownCount={items.length}
            totalItems={totalItems}
            onPageChange={setPage}
          />
        </>
      )}

      <VerificationReviewPanel
        applicationId={selectedId}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onDecision={handleDecision}
      />
    </div>
  )
}
