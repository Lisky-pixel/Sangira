import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { myListingsContent } from '../../placeholder/my-listings-content'

export function PostNewListingTile() {
  return (
    <Link
      to={myListingsContent.routes.postListing}
      aria-label={myListingsContent.postNewListing.ariaLabel}
      className="border-border hover:border-primary/40 flex min-h-[18rem] flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-transparent px-6 py-10 text-center transition-colors"
    >
      <span className="bg-mint-card text-primary mb-4 inline-flex size-12 items-center justify-center rounded-full">
        <Plus aria-hidden="true" className="size-6" />
      </span>
      <span className="text-charcoal font-display text-base font-semibold">
        {myListingsContent.postNewListing.title}
      </span>
      <span className="text-body mt-2 max-w-xs text-sm">
        {myListingsContent.postNewListing.subtitle}
      </span>
    </Link>
  )
}
