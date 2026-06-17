import { useCallback, useRef, type KeyboardEvent } from 'react'
import {
  MY_LISTINGS_TAB_VALUES,
  type MyListingsTab,
} from '../../constants/my-listings'
import { cn } from '../../lib/utils'
import { myListingsContent } from '../../placeholder/my-listings-content'

type ListingStatusTabsProps = {
  activeTab: MyListingsTab
  counts: Record<MyListingsTab, number>
  onTabChange: (tab: MyListingsTab) => void
}

export function ListingStatusTabs({
  activeTab,
  counts,
  onTabChange,
}: ListingStatusTabsProps) {
  const tabRefs = useRef<Partial<Record<MyListingsTab, HTMLButtonElement>>>({})

  const focusTab = useCallback((tab: MyListingsTab) => {
    tabRefs.current[tab]?.focus()
  }, [])

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    tab: MyListingsTab,
  ) => {
    const currentIndex = MY_LISTINGS_TAB_VALUES.indexOf(tab)
    if (currentIndex < 0) return

    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % MY_LISTINGS_TAB_VALUES.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex =
        (currentIndex - 1 + MY_LISTINGS_TAB_VALUES.length) %
        MY_LISTINGS_TAB_VALUES.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = MY_LISTINGS_TAB_VALUES.length - 1
    }

    if (nextIndex === null) {
      return
    }

    event.preventDefault()
    const nextTab = MY_LISTINGS_TAB_VALUES[nextIndex]
    onTabChange(nextTab)
    focusTab(nextTab)
  }

  return (
    <div className="border-border border-b">
      <div
        role="tablist"
        aria-label={myListingsContent.tablistAriaLabel}
        className="-mb-px flex gap-6 overflow-x-auto"
      >
        {MY_LISTINGS_TAB_VALUES.map((tab) => {
          const selected = activeTab === tab
          const label = myListingsContent.tabs[tab]
          const count = counts[tab]

          return (
            <button
              key={tab}
              ref={(element) => {
                tabRefs.current[tab] = element ?? undefined
              }}
              type="button"
              role="tab"
              id={`my-listings-tab-${tab}`}
              aria-selected={selected}
              aria-controls={`my-listings-panel-${tab}`}
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
              {label} {myListingsContent.tabCount(count)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
