import { Footer } from '../components/layout/footer'
import { PublicHeader } from '../components/layout/public-header'
import {
  HeroSection,
  HowItWorksSection,
  StatsSection,
  TransparencySection,
} from '../components/landing'

export function LandingPage() {
  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <PublicHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <StatsSection />
        <TransparencySection />
      </main>
      <Footer />
    </div>
  )
}
