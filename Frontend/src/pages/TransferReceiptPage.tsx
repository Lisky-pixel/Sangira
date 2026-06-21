import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { TransferReceiptView } from '../components/transfer-receipt/transfer-receipt-view'
import { useAuth } from '../auth'
import {
  parseTransferReceiptFrom,
  resolveTransferReceiptBackHref,
} from '../lib/transfer-receipt-navigation'
import { transferReceiptContent } from '../placeholder/transfer-receipt-content'
import { transferReceiptService } from '../services/transfer-receipt-service'
import type { TransferReceipt } from '../types/transfer-receipt'

export function TransferReceiptPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { state } = useAuth()
  const [receipt, setReceipt] = useState<TransferReceipt | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  const requestId = id?.trim()
  const role = state.status === 'authed' ? state.user.role : ''
  const from = parseTransferReceiptFrom(searchParams.get('from'))
  const backHref = resolveTransferReceiptBackHref(from, role)

  useEffect(() => {
    if (!requestId) {
      return
    }

    const activeRequestId = requestId
    let cancelled = false

    async function load() {
      setLoadState('loading')

      try {
        const result = await transferReceiptService.getReceipt(activeRequestId)
        if (!cancelled) {
          setReceipt(result.receipt)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setReceipt(null)
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [requestId])

  if (!requestId) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
          <Link
            to={backHref}
            className="text-primary inline-flex text-sm font-medium hover:underline"
          >
            {transferReceiptContent.backLink}
          </Link>
          <p className="text-clay-red text-sm">
            {transferReceiptContent.loadError}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Link
          to={backHref}
          className="text-primary inline-flex text-sm font-medium hover:underline"
        >
          {transferReceiptContent.backLink}
        </Link>

        {loadState === 'loading' ? (
          <p className="text-body text-sm">{transferReceiptContent.loading}</p>
        ) : null}

        {loadState === 'error' ? (
          <p className="text-clay-red text-sm">
            {transferReceiptContent.loadError}
          </p>
        ) : null}

        {loadState === 'ready' && receipt ? (
          <TransferReceiptView receipt={receipt} />
        ) : null}
      </div>
    </div>
  )
}
