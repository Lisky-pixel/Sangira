import { BarChart3, Shield, Truck } from 'lucide-react'
import {
  landingImageAlt,
  landingImages,
  landingTransparencyContent,
} from '../../placeholder'
import { cn } from '../../lib/utils'

const accentStyles = {
  verified: {
    icon: 'text-verified bg-verified/10',
    subhead: 'text-verified',
  },
  stat: {
    icon: 'text-stat bg-mint-card',
    subhead: 'text-stat',
  },
  amber: {
    icon: 'text-amber bg-amber/10',
    subhead: 'text-amber',
  },
} as const

const featureIcons = {
  verifiedNetwork: Shield,
  realTimeImpact: BarChart3,
  rapidResponse: Truck,
} as const

export function TransparencySection() {
  const { features, heading, subheading, sectionId } =
    landingTransparencyContent

  return (
    <section className="bg-cream py-14 sm:py-16" id={sectionId}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
            {heading}
          </h2>
          <p className="text-body mt-3 text-base leading-relaxed sm:text-lg">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <article className="border-border flex h-full flex-col rounded-2xl border bg-white p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full',
                  accentStyles[features.verifiedNetwork.accent].icon,
                )}
              >
                <Shield aria-hidden="true" className="size-5" />
              </div>
              <div>
                <h3 className="text-charcoal font-display text-lg font-bold">
                  {features.verifiedNetwork.title}
                </h3>
                <p
                  className={cn(
                    'text-sm font-semibold',
                    accentStyles[features.verifiedNetwork.accent].subhead,
                  )}
                >
                  {features.verifiedNetwork.subhead}
                </p>
              </div>
            </div>
            <p className="text-body mt-4 text-sm leading-relaxed">
              {features.verifiedNetwork.description}
            </p>
            <div className="border-border mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border">
              <img
                alt={landingImageAlt.transparencyVan}
                className="h-full min-h-40 w-full flex-1 object-cover"
                height={360}
                src={landingImages.transparencyVan}
                width={640}
              />
            </div>
          </article>

          <div className="flex flex-col gap-6 lg:h-full">
            {(
              [
                ['realTimeImpact', features.realTimeImpact],
                ['rapidResponse', features.rapidResponse],
              ] as const
            ).map(([key, feature]) => {
              const Icon = featureIcons[key]
              const accent = accentStyles[feature.accent]

              return (
                <article
                  key={key}
                  className="border-border flex flex-1 flex-col gap-4 rounded-2xl border bg-white p-6 sm:p-8 lg:min-h-0"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-full',
                        accent.icon,
                      )}
                    >
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-charcoal font-display text-lg font-bold">
                        {feature.title}
                      </h3>
                      <p
                        className={cn('text-sm font-semibold', accent.subhead)}
                      >
                        {feature.subhead}
                      </p>
                    </div>
                  </div>
                  <p className="text-body text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
