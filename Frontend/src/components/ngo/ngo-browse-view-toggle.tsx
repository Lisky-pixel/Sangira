import { cn } from '../../lib/utils'
import { ngoBrowseContent } from '../../placeholder/ngo-browse-content'

export type NgoBrowseViewMode = 'list' | 'map'

type NgoBrowseViewToggleProps = {
  view: NgoBrowseViewMode
  onChange: (view: NgoBrowseViewMode) => void
}

const VIEW_OPTIONS: readonly NgoBrowseViewMode[] = ['list', 'map'] as const

function viewLabel(view: NgoBrowseViewMode) {
  return view === 'list'
    ? ngoBrowseContent.viewToggle.list
    : ngoBrowseContent.viewToggle.map
}

export function NgoBrowseViewToggle({
  view,
  onChange,
}: NgoBrowseViewToggleProps) {
  return (
    <div
      role="group"
      aria-label={ngoBrowseContent.viewToggle.ariaLabel}
      className="border-border inline-flex rounded-lg border bg-white p-1 shadow-sm"
    >
      {VIEW_OPTIONS.map((option) => {
        const active = view === option

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-white'
                : 'text-charcoal hover:bg-sand/60',
            )}
          >
            {viewLabel(option)}
          </button>
        )
      })}
    </div>
  )
}
