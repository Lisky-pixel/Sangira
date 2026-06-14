const stats = [
  { value: '11,656', label: 'Meals redistributed' },
  { value: '2', label: 'Tonnes waste prevented' },
  { value: '53', label: 'Verified organisations' },
]

export function ImpactStats() {
  return (
    <section id="our-impact" className="bg-sangira-mint">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 sm:grid-cols-3 lg:px-8 lg:py-16">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white px-8 py-10 text-center shadow-sm"
          >
            <p className="font-serif text-4xl text-sangira-green sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-sangira-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
