import { Check } from 'lucide-react'
import { ngoProfileContent } from '../../placeholder/ngo-profile-content'
import { formatShortMonthYear } from '../../lib/profile-format'

type NgoTrackRecordCardProps = {
  pickupsCompleted: number
  mealsReceived: number
  verifiedAt?: string | Date
  loadState: 'loading' | 'ready' | 'error'
}

export function NgoTrackRecordCard({
  pickupsCompleted,
  mealsReceived,
  verifiedAt,
  loadState,
}: NgoTrackRecordCardProps) {
  const verifiedSince = formatShortMonthYear(verifiedAt)

  if (loadState === 'loading') {
    return (
      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <p className="text-body text-center text-sm">
          {ngoProfileContent.trackRecord.loading}
        </p>
      </section>
    )
  }

  if (loadState === 'error') {
    return (
      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <p className="text-clay-red text-center text-sm">
          {ngoProfileContent.trackRecord.loadError}
        </p>
      </section>
    )
  }

  return (
    <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
      <h2 className="text-body text-center text-xs font-medium tracking-wide uppercase">
        {ngoProfileContent.trackRecord.sectionLabel}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
        <div className="text-center sm:border-border sm:border-r sm:pr-4">
          <p className="text-charcoal font-display text-3xl font-bold">
            {pickupsCompleted}
          </p>
          <p className="text-body mt-1 text-sm">
            {ngoProfileContent.trackRecord.pickupsCompletedLabel}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-center sm:border-border sm:border-r sm:pr-4">
          <span className="bg-status-completed text-status-active inline-flex size-6 items-center justify-center rounded-full">
            <Check aria-hidden="true" className="size-3.5" />
          </span>
          <div>
            <p className="text-charcoal text-sm font-semibold">
              {ngoProfileContent.trackRecord.verifiedLabel}
            </p>
            {verifiedSince ? (
              <p className="text-body mt-0.5 text-sm">
                {ngoProfileContent.trackRecord.verifiedSince(verifiedSince)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="text-center">
          <p className="text-charcoal font-display text-3xl font-bold">
            {mealsReceived.toLocaleString()}
          </p>
          <p className="text-body mt-1 text-sm">
            {ngoProfileContent.trackRecord.mealsReceivedLabel}
          </p>
        </div>
      </div>
    </section>
  )
}
