import { Check } from 'lucide-react'
import { getPlaceholderDonorTrackRecord } from '../../placeholder/donor-profile-stats-data'
import { donorProfileContent } from '../../placeholder/donor-profile-content'
import { formatShortMonthYear } from '../../lib/profile-format'

type ProfileTrackRecordCardProps = {
  donorId: string
  verifiedAt?: string | Date
}

/**
 * PLACEHOLDER boundary — transfers/meals counts swap when live stats ship.
 * Verified-since date is real from verification.reviewedAt.
 */
export function ProfileTrackRecordCard({
  donorId,
  verifiedAt,
}: ProfileTrackRecordCardProps) {
  const stats = getPlaceholderDonorTrackRecord(donorId)
  const verifiedSince = formatShortMonthYear(verifiedAt)

  return (
    <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
      <h2 className="text-body text-xs font-medium tracking-wide uppercase">
        {donorProfileContent.trackRecord.sectionLabel}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
        <div className="sm:border-border sm:border-r sm:pr-4">
          <p className="text-charcoal font-display text-3xl font-bold">
            {stats.transfersCompleted}
          </p>
          <p className="text-body mt-1 text-sm">
            {donorProfileContent.trackRecord.transfersCompletedLabel}
          </p>
        </div>

        <div className="sm:border-border sm:border-r sm:pr-4">
          <p className="text-charcoal font-display text-3xl font-bold">
            {stats.mealsRedistributed.toLocaleString()}
          </p>
          <p className="text-body mt-1 text-sm">
            {donorProfileContent.trackRecord.mealsRedistributedLabel}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <span className="bg-status-completed text-status-active mt-1 inline-flex size-6 items-center justify-center rounded-full">
            <Check aria-hidden="true" className="size-3.5" />
          </span>
          <div>
            <p className="text-charcoal text-sm font-semibold">Verified</p>
            {verifiedSince ? (
              <p className="text-body mt-0.5 text-sm">
                {donorProfileContent.trackRecord.verifiedSince(verifiedSince)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
