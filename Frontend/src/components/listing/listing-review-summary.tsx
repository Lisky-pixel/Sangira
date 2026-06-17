import type { PostListingFormValues } from '../../features/post-listing/post-listing-schema'
import { formatListingExpiresAt } from '../../lib/preset-datetime'
import { postListingContent } from '../../placeholder/post-listing-content'
import type { FoodLabel } from '../../constants/listing-form'

type ListingReviewSummaryProps = {
  values: Partial<PostListingFormValues>
}

function formatDietary(labels: FoodLabel[] | undefined) {
  if (!labels?.length) {
    return postListingContent.review.none
  }

  return labels
    .map((label) => postListingContent.foodLabelLabels[label])
    .join(', ')
}

export function ListingReviewSummary({ values }: ListingReviewSummaryProps) {
  const foodTypeLabel = values.foodType
    ? postListingContent.foodTypeLabels[values.foodType]
    : '—'
  const unitLabel = values.quantityUnit
    ? postListingContent.quantityUnitLabels[values.quantityUnit]
    : ''
  const item =
    values.quantity && values.foodType
      ? `${values.quantity} ${unitLabel} ${foodTypeLabel}`
      : '—'
  const expires = values.expiresAt
    ? formatListingExpiresAt(values.expiresAt)
    : '—'
  const dietary = formatDietary(values.foodLabels)
  const pickup = values.pickupAddress?.trim() || '—'

  const rows = [
    { label: postListingContent.review.item, value: item },
    { label: postListingContent.review.expires, value: expires },
    { label: postListingContent.review.dietary, value: dietary },
    { label: postListingContent.review.pickup, value: pickup },
  ]

  return (
    <section
      aria-label={postListingContent.review.heading}
      className="bg-mint-card rounded-2xl p-5 sm:p-6"
    >
      <h2 className="text-charcoal mb-4 text-xs font-semibold tracking-wide uppercase">
        {postListingContent.review.heading}
      </h2>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="min-w-0">
            <dt className="text-body text-xs font-medium tracking-wide uppercase">
              {row.label}
            </dt>
            <dd className="text-charcoal mt-1 text-sm font-medium break-words">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
