import { ButtonLink } from '../ui/button'
import {
  landingHeroContent,
  landingImageAlt,
  landingImages,
} from '../../placeholder'
import { ROUTES } from '../../routes/paths'

export function HeroSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-6">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            {landingHeroContent.eyebrow}
          </p>
          <h1 className="text-charcoal font-display text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            {landingHeroContent.heading}
          </h1>
          <p className="text-body max-w-xl text-base leading-relaxed sm:text-lg">
            {landingHeroContent.subcopy}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink to={ROUTES.REGISTER_DONOR} size="lg">
              {landingHeroContent.donorCta}
            </ButtonLink>
            <ButtonLink to={ROUTES.REGISTER_NGO} variant="outline" size="lg">
              {landingHeroContent.ngoCta}
            </ButtonLink>
          </div>
        </div>

        <div>
          <img
            alt={landingImageAlt.hero}
            className="border-border aspect-[4/3] w-full rounded-2xl border object-cover shadow-sm"
            height={480}
            src={landingImages.hero}
            width={640}
          />
        </div>
      </div>
    </section>
  )
}
