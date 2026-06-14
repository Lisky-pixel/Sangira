import { BarChart3, MapPinCheck, Truck } from 'lucide-react'

const features = [
  {
    icon: MapPinCheck,
    eyebrow: 'Verified network',
    title: 'Institutional trust',
    description:
      'Every donor and NGO undergoes a rigorous verification process to ensure food safety and institutional reliability.',
    image: '/images/verified-network.png',
    imageAlt:
      'Delivery van loaded with crates of fresh produce outside a community center in Kigali',
    large: true,
  },
  {
    icon: BarChart3,
    eyebrow: 'Real-time impact',
    title: 'Live tracking',
    description:
      'Donors can see exactly where their surplus food goes, with clear records of every completed transfer.',
    large: false,
  },
  {
    icon: Truck,
    eyebrow: 'Rapid response',
    title: 'Efficient pickup',
    description:
      'Intelligent matching reduces transit time and emissions, getting perishable food to those who need it faster.',
    large: false,
  },
]

export function TransparencySection() {
  const [featured, ...compact] = features

  return (
    <section id="about" className="bg-sangira-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-serif text-3xl text-sangira-green sm:text-4xl">
            Built for transparency
          </h2>
          <p className="mt-4 text-base leading-relaxed text-sangira-muted">
            Sangira provides the infrastructure for a safe, dignity-first
            food system.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-sangira-green/10 bg-white shadow-sm">
            <div className="space-y-4 p-8">
              <div className="flex items-center gap-2 text-sm font-medium text-sangira-green">
                <featured.icon className="h-4 w-4" strokeWidth={1.75} />
                {featured.eyebrow}
              </div>
              <h3 className="font-serif text-2xl text-sangira-green">
                {featured.title}
              </h3>
              <p className="text-sm leading-relaxed text-sangira-muted">
                {featured.description}
              </p>
            </div>
            <img
              src={featured.image}
              alt={featured.imageAlt}
              className="aspect-[16/9] w-full object-cover"
            />
          </article>

          <div className="flex flex-col gap-6">
            {compact.map((feature) => (
              <article
                key={feature.title}
                className="flex-1 rounded-2xl border border-sangira-green/10 bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-sangira-green">
                  <feature.icon className="h-4 w-4" strokeWidth={1.75} />
                  {feature.eyebrow}
                </div>
                <h3 className="mt-4 font-serif text-2xl text-sangira-green">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-sangira-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
