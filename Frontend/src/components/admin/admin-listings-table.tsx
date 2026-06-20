import { ADMIN_LISTING_DISPLAY_STATUS } from '../../constants/admin-listings'
import {
  formatAdminListingExpiresAt,
  formatAdminListingPostedAt,
} from '../../lib/format-admin-listing-time'
import { adminListingsContent } from '../../placeholder/admin-listings-content'
import type { AdminListingListItem } from '../../types/admin-listings'
import { StatusChip, type StatusChipVariant } from '../ui/status-chip'
import { VerifiedBadge } from '../ui/verified-badge'

type AdminListingsTableProps = {
  listings: AdminListingListItem[]
}

function resolveStatusChip(
  displayStatus: AdminListingListItem['displayStatus'],
): { variant: StatusChipVariant; label: string } {
  const { table } = adminListingsContent

  switch (displayStatus) {
    case ADMIN_LISTING_DISPLAY_STATUS.AWAITING_PICKUP:
      return {
        variant: 'awaiting_pickup',
        label: table.statusAwaitingPickup,
      }
    case ADMIN_LISTING_DISPLAY_STATUS.COMPLETED:
      return { variant: 'completed', label: table.statusCompleted }
    case ADMIN_LISTING_DISPLAY_STATUS.EXPIRED:
      return { variant: 'rejected', label: table.statusExpired }
    default:
      return { variant: 'active', label: table.statusActive }
  }
}

export function AdminListingsTable({ listings }: AdminListingsTableProps) {
  const { table } = adminListingsContent

  return (
    <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-sand/80 text-charcoal">
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.listing}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.donor}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.quantity}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.posted}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.expires}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.status}
              </th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {table.requests}
              </th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => {
              const statusChip = resolveStatusChip(listing.displayStatus)
              const expiresLabel = formatAdminListingExpiresAt(
                listing.expiresAt,
                listing.displayStatus,
              )

              return (
                <tr
                  key={listing.id}
                  className="border-border border-t"
                >
                  <td className="text-charcoal px-4 py-4 font-medium">
                    {listing.title}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-charcoal truncate font-medium">
                        {listing.donor.organisationName}
                      </span>
                      {listing.donor.verified ? <VerifiedBadge /> : null}
                    </div>
                  </td>
                  <td className="text-body px-4 py-4">
                    {listing.quantityLabel}
                  </td>
                  <td className="text-body px-4 py-4">
                    {formatAdminListingPostedAt(listing.postedAt)}
                  </td>
                  <td className="text-body px-4 py-4">
                    {expiresLabel ?? table.expiresDash}
                  </td>
                  <td className="px-4 py-4">
                    <StatusChip
                      status={statusChip.variant}
                      label={statusChip.label}
                      className="whitespace-nowrap"
                    />
                  </td>
                  <td className="text-body px-4 py-4">
                    {listing.requestsCount}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
