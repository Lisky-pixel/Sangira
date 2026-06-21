import { Footer } from '../components/layout/footer'
import { PublicHeader } from '../components/layout/public-header'
import { TermsContentView } from '../components/legal/terms-content-view'
import { useSmartBack } from '../hooks/use-smart-back'
import { termsContent } from '../placeholder/terms-content'

export function TermsPage() {
  const handleBack = useSmartBack()

  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <PublicHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <button
          type="button"
          onClick={handleBack}
          className="text-primary mb-6 inline-flex text-sm font-medium hover:underline"
        >
          {termsContent.pageBackLabel}
        </button>

        <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <TermsContentView />
        </div>
      </main>

      <Footer />
    </div>
  )
}
