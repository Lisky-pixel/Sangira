import { Plus } from 'lucide-react'
import { myListingsContent } from '../../placeholder/my-listings-content'
import { useParticipantEditBlocked } from '../../hooks/use-participant-edit-blocked'
import { ParticipantActionLink } from '../participant/participant-action-control'
import { cn } from '../../lib/utils'

export function PostNewListingTile() {
  const { blocked, message } = useParticipantEditBlocked()

  if (blocked) {
    return (
      <span
        title={message ?? undefined}
        className="border-border flex min-h-[18rem] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-transparent px-6 py-10 text-center opacity-60"
        aria-disabled="true"
      >
        <span className="bg-mint-card text-primary mb-4 inline-flex size-12 items-center justify-center rounded-full">
          <Plus aria-hidden="true" className="size-6" />
        </span>
        <span className="text-charcoal font-display text-base font-semibold">
          {myListingsContent.postNewListing.title}
        </span>
        {message ? (
          <p className="text-body mt-3 max-w-xs text-sm">{message}</p>
        ) : null}
      </span>
    )
  }

  return (
    <ParticipantActionLink
      to={myListingsContent.routes.postListing}
      aria-label={myListingsContent.postNewListing.ariaLabel}
      className={cn(
        'border-border hover:border-primary/40 flex min-h-[18rem] flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-transparent px-6 py-10 text-center transition-colors',
      )}
      showBlockNote={false}
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
    </ParticipantActionLink>
  )
}
