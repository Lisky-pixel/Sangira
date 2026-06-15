import { Handshake, QrCode, Shield } from 'lucide-react'
import { landingHowItWorksContent } from '../../placeholder/landing-content'
import { cn } from '../../lib/utils'

const stepIcons = {
  shield: Shield,
  handshake: Handshake,
  'qr-code': QrCode,
} as const

export function HowItWorksSection() {
  return (
    <section
      className="bg-white py-14 sm:py-16"
      id={landingHowItWorksContent.sectionId}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {landingHowItWorksContent.steps.map((step) => {
            const Icon = stepIcons[step.icon]

            return (
              <article
                key={step.title}
                className="flex flex-col items-start gap-4"
              >
                <div
                  className={cn(
                    'bg-mint-card text-stat flex size-12 items-center justify-center rounded-full',
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.75}
                  />
                </div>
                <h2 className="text-charcoal font-display text-lg font-bold">
                  {step.title}
                </h2>
                <p className="text-body text-sm leading-relaxed">
                  {step.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
