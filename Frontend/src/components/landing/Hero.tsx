import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="bg-sangira-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sangira-green">
            Sangira
          </p>
          <h1 className="font-serif text-4xl leading-tight text-sangira-green sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            No meal should go to waste while someone goes hungry
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-sangira-muted lg:text-lg">
            Sangira connects verified food donors with trusted recipient
            organizations in Kigali, creating a reliable chain of food
            redistribution that prevents waste and feeds communities.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg">I have surplus food</Button>
            <Button variant="outline" size="lg">
              I represent an NGO
            </Button>
          </div>
        </div>

        <div className="relative">
          <img
            src="/images/hero.png"
            alt="Aid workers carrying a crate of food containers at a Kigali community center"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
          />
        </div>
      </div>
    </section>
  )
}
