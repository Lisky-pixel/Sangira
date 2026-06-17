import { comingSoonContent } from '../../placeholder/landing-content'

/** TEMPORARY — in-layout placeholder for donor routes not yet implemented */
export function DonorComingSoon() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-charcoal font-display text-3xl font-bold">
        {comingSoonContent.heading}
      </h1>
      <p className="text-body text-base">{comingSoonContent.subcopy}</p>
    </div>
  )
}
