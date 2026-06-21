import { Info, Search } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from '../../auth'
import type { FoodType, StorageCondition } from '../../constants/listing-form'
import { hasNgoServiceCoordinates } from '../../lib/ngo-service-location'
import { cn } from '../../lib/utils'
import { ngoBrowseContent } from '../../placeholder/ngo-browse-content'
import { ROUTES } from '../../routes/paths'
import type { NgoBrowseFilters } from '../../lib/ngo-browse-filters'
import { toggleFilterValue } from '../../lib/ngo-browse-filters'

type NgoBrowseFilterBarProps = {
  filters: NgoBrowseFilters
  onChange: (next: NgoBrowseFilters) => void
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-border text-charcoal bg-white hover:border-primary/40',
      )}
    >
      {label}
    </button>
  )
}

export function NgoBrowseFilterBar({
  filters,
  onChange,
}: NgoBrowseFilterBarProps) {
  const { state } = useAuth()
  const showLocationHint =
    state.status === 'authed' &&
    state.user.role === 'ngo' &&
    !hasNgoServiceCoordinates(state.user)

  const toggleFoodType = (foodType: FoodType) => {
    onChange({
      ...filters,
      foodTypes: toggleFilterValue(filters.foodTypes, foodType),
    })
  }

  const toggleStorage = (storageCondition: StorageCondition) => {
    onChange({
      ...filters,
      storageConditions: toggleFilterValue(
        filters.storageConditions,
        storageCondition,
      ),
    })
  }

  return (
    <section className="border-border rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
      <label className="flex flex-col gap-2">
        <span className="sr-only">{ngoBrowseContent.filters.searchLabel}</span>
        <span className="relative">
          <Search
            aria-hidden="true"
            className="text-body pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder={ngoBrowseContent.filters.searchPlaceholder}
            className="border-border text-charcoal placeholder:text-status-neutral w-full rounded-lg border bg-white py-2.5 pr-3 pl-10 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </span>
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {ngoBrowseContent.filterFoodTypes.map((foodType) => (
          <FilterChip
            key={foodType}
            label={ngoBrowseContent.foodTypeLabels[foodType]}
            active={filters.foodTypes.includes(foodType)}
            onClick={() => toggleFoodType(foodType)}
          />
        ))}

        {ngoBrowseContent.filterStorageConditions.map((storageCondition) => (
          <FilterChip
            key={storageCondition}
            label={ngoBrowseContent.storageLabels[storageCondition]}
            active={filters.storageConditions.includes(storageCondition)}
            onClick={() => toggleStorage(storageCondition)}
          />
        ))}

        <FilterChip
          label={ngoBrowseContent.filters.expiresToday}
          active={filters.expiresToday}
          onClick={() =>
            onChange({
              ...filters,
              expiresToday: !filters.expiresToday,
            })
          }
        />

      </div>

      {showLocationHint ? (
        <p className="text-body mt-4 flex items-start gap-2 text-sm">
          <Info
            aria-hidden="true"
            className="text-primary mt-0.5 size-4 shrink-0"
          />
          <span>
            {ngoBrowseContent.filters.locationHint}{' '}
            <Link
              to={ROUTES.NGO_PROFILE}
              className="text-primary font-medium hover:underline"
            >
              {ngoBrowseContent.filters.locationHintLink}
            </Link>
            .
          </span>
        </p>
      ) : null}
    </section>
  )
}
