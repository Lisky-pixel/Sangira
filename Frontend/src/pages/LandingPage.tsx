import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { ImpactStats } from '@/components/landing/ImpactStats'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { SectionDivider } from '@/components/landing/SectionDivider'
import { TransparencySection } from '@/components/landing/TransparencySection'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-sangira-cream">
      <Header />
      <SectionDivider />
      <main>
        <Hero />
        <ProcessSection />
        <ImpactStats />
        <TransparencySection />
      </main>
      <Footer />
    </div>
  )
}
