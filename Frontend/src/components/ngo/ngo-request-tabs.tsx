import { useCallback, useRef, type KeyboardEvent } from 'react'
import {
  NGO_REQUESTS_TAB_VALUES,
  type NgoRequestsTab,
} from '../../constants/ngo-requests'
import { cn } from '../../lib/utils'
import { ngoMyRequestsContent } from '../../placeholder/ngo-my-requests-content'
import type { NgoMyRequestsCounts } from '../../types/ngo-my-request'

type NgoRequestTabsProps = {
  activeTab: NgoRequestsTab
  counts: NgoMyRequestsCounts
  onTabChange: (tab: NgoRequestsTab) => void
}

export function NgoRequestTabs({
  activeTab,
  counts,
  onTabChange,
}: NgoRequestTabsProps) {
  const tabRefs = useRef<Partial<Record<NgoRequestsTab, HTMLButtonElement>>>({})

  const focusTab = useCallback((tab: NgoRequestsTab) => {
    tabRefs.current[tab]?.focus()
  }, [])

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    tab: NgoRequestsTab,
  ) => {
    const currentIndex = NGO_REQUESTS_TAB_VALUES.indexOf(tab)
    if (currentIndex < 0) return

    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % NGO_REQUESTS_TAB_VALUES.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex =
        (currentIndex - 1 + NGO_REQUESTS_TAB_VALUES.length) %
        NGO_REQUESTS_TAB_VALUES.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = NGO_REQUESTS_TAB_VALUES.length - 1
    }

    if (nextIndex === null) {
      return
    }

    event.preventDefault()
    const nextTab = NGO_REQUESTS_TAB_VALUES[nextIndex]
    onTabChange(nextTab)
    focusTab(nextTab)
  }

  return (
    <div className="border-border border-b">
      <div
        role="tablist"
        aria-label={ngoMyRequestsContent.tablistAriaLabel}
        className="-mb-px flex gap-4 overflow-x-auto sm:gap-6"
      >
        {NGO_REQUESTS_TAB_VALUES.map((tab) => {
          const selected = activeTab === tab
          const label = ngoMyRequestsContent.tabs[tab]
          const count = counts[tab]

          return (
            <button
              key={tab}
              ref={(element) => {
                tabRefs.current[tab] = element ?? undefined
              }}
              type="button"
              role="tab"
              id={`ngo-requests-tab-${tab}`}
              aria-selected={selected}
              aria-controls={`ngo-requests-panel-${tab}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onTabChange(tab)}
              onKeyDown={(event) => handleKeyDown(event, tab)}
              className={cn(
                'text-body shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors',
                selected
                  ? 'border-primary text-primary'
                  : 'hover:text-primary border-transparent',
              )}
            >
              {label} {ngoMyRequestsContent.tabCount(count)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
