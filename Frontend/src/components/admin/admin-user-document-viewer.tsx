import { FileText, ZoomIn, ZoomOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'
import { adminUsersContent } from '../../placeholder/admin-users-content'
import { adminPortalService } from '../../services/admin-portal-service'
import type { AdminUserDocumentMeta } from '../../types/admin-users'

const ZOOM_MIN = 0.75
const ZOOM_MAX = 2
const ZOOM_STEP = 0.25

type AdminUserDocumentViewerProps = {
  userId: string
  document?: AdminUserDocumentMeta
}

function isPdfDocument(document?: AdminUserDocumentMeta): boolean {
  if (!document) return false
  if (document.format === 'pdf') return true
  return document.filename.toLowerCase().endsWith('.pdf')
}

export function AdminUserDocumentViewer({
  userId,
  document,
}: AdminUserDocumentViewerProps) {
  const [viewUrl, setViewUrl] = useState<string | null>(null)
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  )
  const [zoom, setZoom] = useState(1)
  const { profilePanel } = adminUsersContent

  useEffect(() => {
    if (!document) {
      return
    }

    let cancelled = false

    const load = async () => {
      setLoadState('loading')
      try {
        const view = await adminPortalService.getUserDocumentView(userId)
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
  }, [userId, document])

  if (!document) {
    return (
      <p className="text-body text-sm">{profilePanel.documentMissing}</p>
    )
  }

  const isPdf = isPdfDocument(document)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-body text-xs font-semibold tracking-wide uppercase">
          {profilePanel.documentSectionTitle}
        </h3>
        {loadState === 'ready' && !isPdf ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoom((current) => Math.max(ZOOM_MIN, current - ZOOM_STEP))}
              disabled={zoom <= ZOOM_MIN}
              aria-label="Zoom out"
              className="text-body hover:text-charcoal disabled:opacity-40"
            >
              <ZoomOut aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((current) => Math.min(ZOOM_MAX, current + ZOOM_STEP))}
              disabled={zoom >= ZOOM_MAX}
              aria-label="Zoom in"
              className="text-body hover:text-charcoal disabled:opacity-40"
            >
              <ZoomIn aria-hidden="true" className="size-4" />
            </button>
          </div>
        ) : null}
      </div>

      {loadState === 'loading' ? (
        <p className="text-body text-sm">{profilePanel.documentLoading}</p>
      ) : loadState === 'error' ? (
        <p className="text-clay-red text-sm">{profilePanel.documentError}</p>
      ) : viewUrl ? (
        isPdf ? (
          <div className="border-border flex items-center gap-3 rounded-lg border bg-sand/40 p-4">
            <FileText aria-hidden="true" className="text-body size-5 shrink-0" />
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm font-medium hover:underline"
            >
              {document.filename}
            </a>
          </div>
        ) : (
          <div className="border-border overflow-auto rounded-lg border bg-sand/30 p-3">
            <img
              src={viewUrl}
              alt={document.filename}
              className={cn('mx-auto max-w-full origin-top transition-transform')}
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        )
      ) : null}
    </div>
  )
}
