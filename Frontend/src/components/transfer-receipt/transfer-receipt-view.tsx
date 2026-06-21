import { ArrowRight, Leaf, MapPin, Scale } from 'lucide-react'
import { formatCompletedAt } from '../../lib/format-completed-at'
import { formatRelativeTime } from '../../lib/relative-time'
import { postListingContent } from '../../placeholder/post-listing-content'
import { transferReceiptContent } from '../../placeholder/transfer-receipt-content'
import type { TransferReceipt } from '../../types/transfer-receipt'
import { StatusChip } from '../ui/status-chip'
import { VerifiedBadge } from '../ui/verified-badge'
import { ConditionReportChip } from './condition-report-chip'

type TransferReceiptViewProps = {
  receipt: TransferReceipt
}

function buildImpactLines(receipt: TransferReceipt): string[] {
  const lines: string[] = []
  const { impact } = receipt

  if (impact.mealsRedistributed && impact.mealsRedistributed > 0) {
    lines.push(transferReceiptContent.impactMeals(impact.mealsRedistributed))
  }

  if (impact.wasteKgPrevented && impact.wasteKgPrevented > 0) {
    lines.push(transferReceiptContent.impactKg(impact.wasteKgPrevented))
  }

  if (impact.itemsRedistributed && impact.itemsRedistributed > 0) {
    lines.push(transferReceiptContent.impactItems(impact.itemsRedistributed))
  }

  return lines
}

function resolveConditionNote(receipt: TransferReceipt): string | null {
  const note = receipt.conditionReport.note?.trim()
  if (note) {
    return note
  }

  const fallback =
    transferReceiptContent.conditionDefaultNote[receipt.conditionReport.condition]

  return fallback || null
}

export function TransferReceiptView({ receipt }: TransferReceiptViewProps) {
  const foodTypeLabel = postListingContent.foodTypeLabels[receipt.food.foodType]
  const foodLine = transferReceiptContent.quantityLine({
    title: receipt.food.title,
    quantity: receipt.food.quantity,
    quantityUnit: receipt.food.quantityUnit,
    foodTypeLabel,
  })
  const impactLines = buildImpactLines(receipt)
  const conditionNote = resolveConditionNote(receipt)
  const relativeCompleted = formatRelativeTime(receipt.completedAt)
  const absoluteCompleted = formatCompletedAt(receipt.completedAt)

  return (
    <article className="border-border rounded-2xl border bg-white shadow-sm">
      <header className="border-border border-b px-5 py-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip
            status="completed"
            label={transferReceiptContent.completedStatus}
          />
          {relativeCompleted ? (
            <span className="text-body text-sm">{relativeCompleted}</span>
          ) : null}
        </div>
        <h1 className="text-charcoal font-display mt-4 text-2xl font-bold">
          {transferReceiptContent.pageTitle}
        </h1>
        {absoluteCompleted ? (
          <p className="text-body/70 mt-1 text-sm">{absoluteCompleted}</p>
        ) : null}
      </header>

      <div className="flex flex-col gap-6 px-5 py-6 sm:px-6">
        <section aria-label="Transfer parties">
          <div className="bg-sand flex flex-col gap-4 rounded-xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-body text-xs font-medium tracking-wide uppercase">
                {transferReceiptContent.fromLabel}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-charcoal text-sm font-semibold">
                  {receipt.donor.organisationName}
                </span>
                {receipt.donor.verified ? <VerifiedBadge /> : null}
              </div>
            </div>

            <ArrowRight
              aria-hidden="true"
              className="text-body/50 mx-auto size-5 shrink-0 sm:mx-0"
            />

            <div className="min-w-0 flex-1 sm:text-right">
              <p className="text-body text-xs font-medium tracking-wide uppercase">
                {transferReceiptContent.toLabel}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="text-charcoal text-sm font-semibold">
                  {receipt.ngo.organisationName}
                </span>
                {receipt.ngo.verified ? <VerifiedBadge /> : null}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-charcoal text-sm font-semibold">
            {transferReceiptContent.foodHeading}
          </h2>
          <p className="text-charcoal mt-2 text-base font-medium">
            {foodLine.title}
          </p>
          <p className="text-body mt-1 text-sm">{foodLine.detail}</p>
        </section>

        {impactLines.length > 0 ? (
          <section>
            <h2 className="text-charcoal text-sm font-semibold">
              {transferReceiptContent.impactHeading}
            </h2>
            <div className="bg-mint-card text-primary mt-3 flex items-start gap-2 rounded-lg px-4 py-3 text-sm font-medium">
              <Scale aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <div className="flex flex-col gap-1">
                {impactLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-primary/20 bg-mint-card/40 rounded-xl border px-4 py-5">
          <div className="flex items-start gap-2">
            <Leaf
              aria-hidden="true"
              className="text-primary mt-0.5 size-4 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-charcoal text-sm font-semibold">
                {transferReceiptContent.conditionHeading}
              </h2>
              <p className="text-body mt-1 text-sm">
                {transferReceiptContent.conditionSubheading}
              </p>
              <div className="mt-4">
                <ConditionReportChip condition={receipt.conditionReport.condition} />
              </div>
              {conditionNote ? (
                <p className="text-charcoal mt-3 text-sm leading-relaxed">
                  {conditionNote}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {receipt.pickupAddress ? (
          <section>
            <h2 className="text-charcoal text-sm font-semibold">
              {transferReceiptContent.pickupHeading}
            </h2>
            <div className="text-body mt-2 flex items-start gap-2 text-sm">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>{receipt.pickupAddress}</span>
            </div>
          </section>
        ) : null}

        <p className="text-body/60 text-xs">
          {transferReceiptContent.referenceLabel}:{' '}
          {transferReceiptContent.referenceValue(receipt.id)}
        </p>
      </div>
    </article>
  )
}
