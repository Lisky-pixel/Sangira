import { BadgeCheck, Handshake, Tags } from 'lucide-react'

const steps = [
  {
    icon: BadgeCheck,
    title: 'Get verified',
    description:
      'Complete a simple registration to join our trusted network.',
  },
  {
    icon: Tags,
    title: 'Get matched',
    description:
      'Connect with verified donors or organisations in your sector.',
  },
  {
    icon: Handshake,
    title: 'Confirm pickup',
    description:
      'Securely hand over and track every redistribution event.',
  },
]

export function ProcessSection() {
  return (
    <section id="how-it-works" className="bg-sangira-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3 lg:px-8 lg:py-20">
        {steps.map((step) => (
          <article key={step.title} className="space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sangira-mint text-sangira-green">
              <step.icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h2 className="font-serif text-xl text-sangira-green">
              {step.title}
            </h2>
            <p className="text-sm leading-relaxed text-sangira-muted">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
