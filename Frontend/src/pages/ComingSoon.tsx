import { Footer } from '../components/layout/footer'
import { PublicHeader } from '../components/layout/public-header'
import { ButtonLink } from '../components/ui/button'
import { comingSoonContent } from '../placeholder/landing-content'
import { ROUTES } from '../routes/paths'

/**
 * TEMPORARY — shared placeholder for routes not yet implemented.
 */
export function ComingSoon() {
  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <PublicHeader />
      <main className="mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="text-charcoal font-display text-3xl font-bold">
          {comingSoonContent.heading}
        </h1>
        <p className="text-body max-w-md text-base">
          {comingSoonContent.subcopy}
        </p>
        <ButtonLink to={ROUTES.HOME} variant="outline">
          {comingSoonContent.backLabel}
        </ButtonLink>
      </main>
      <Footer />
    </div>
  )
}
