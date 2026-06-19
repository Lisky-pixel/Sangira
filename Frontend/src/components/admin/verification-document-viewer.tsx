import { FileText, ZoomIn, ZoomOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'
import { adminVerificationContent } from '../../placeholder/admin-verification-content'
import { adminPortalService } from '../../services/admin-portal-service'
import type { VerificationDocumentMeta } from '../../types/admin-verification'

const ZOOM_MIN = 0.75
const ZOOM_MAX = 2
const ZOOM_STEP = 0.25

type VerificationDocumentViewerProps = {
  applicationId: string
  document?: VerificationDocumentMeta
}

function isPdfDocument(document?: VerificationDocumentMeta): boolean {
  if (!document) return false
  if (document.format === 'pdf') return true
  return document.filename.toLowerCase().endsWith('.pdf')
}

export function VerificationDocumentViewer({
  applicationId,
  document,
}: VerificationDocumentViewerProps) {
  const [viewUrl, setViewUrl] = useState<string | null>(null)
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  )
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!document) {
      return
    }

    let cancelled = false

    const load = async () => {
      setLoadState('loading')
      try {
        const view = await adminPortalService.getVerificationDocumentView(
          applicationId,
        )
        if (!cancelled) {
          setViewUrl(view.url)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setViewUrl(null)
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [applicationId, document])

  const { reviewPanel } = adminVerificationContent

  if (!document) {
    return (
      <p className="text-body text-sm">{reviewPanel.documentMissing}</p>
    )
  }

  const isPdf = isPdfDocument(document)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-body text-xs font-semibold tracking-wide uppercase">
          {reviewPanel.documentSectionTitle}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setZoom((current) => Math.max(ZOOM_MIN, current - ZOOM_STEP))
            }
            disabled={zoom <= ZOOM_MIN || loadState !== 'ready'}
            aria-label={reviewPanel.zoomOutAria}
            className="border-border text-charcoal hover:text-primary flex size-8 items-center justify-center rounded-md border bg-white transition-colors disabled:opacity-50"
          >
            <ZoomOut aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setZoom((current) => Math.min(ZOOM_MAX, current + ZOOM_STEP))
            }
            disabled={zoom >= ZOOM_MAX || loadState !== 'ready'}
            aria-label={reviewPanel.zoomInAria}
            className="border-border text-charcoal hover:text-primary flex size-8 items-center justify-center rounded-md border bg-white transition-colors disabled:opacity-50"
          >
            <ZoomIn aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div className="border-border bg-sand/40 relative min-h-56 overflow-auto rounded-xl border">
        {loadState === 'loading' ? (
          <p className="text-body p-6 text-sm">{reviewPanel.documentLoading}</p>
        ) : loadState === 'error' ? (
          <p className="text-clay-red p-6 text-sm">{reviewPanel.documentError}</p>
        ) : viewUrl && isPdf ? (
          <div
            className="origin-top-left"
            style={{ transform: `scale(${zoom})`, width: `${100 / zoom}%` }}
          >
            <iframe
              title={document.filename}
              src={viewUrl}
              className="h-80 w-full rounded-xl"
            />
          </div>
        ) : viewUrl ? (
          <div className="flex min-h-56 items-center justify-center p-4">
            <img
              src={viewUrl}
              alt={document.filename}
              className={cn('max-h-96 max-w-full object-contain')}
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        ) : (
          <div className="text-body flex flex-col items-center justify-center gap-2 p-8 text-sm">
            <FileText aria-hidden="true" className="size-10 opacity-50" />
            <span>{document.filename}</span>
          </div>
        )}
      </div>

      {document.filename ? (
        <p className="text-body text-xs">{document.filename}</p>
      ) : null}
    </div>
  )
}
