import { Download } from 'lucide-react'
import { donorImpactContent } from '../../placeholder/donor-impact-content'
import { Button } from '../ui/button'
import { toast } from '../../lib/toast'

export function DonorImpactShareCard() {
  const handleDownload = () => {
    toast.info(donorImpactContent.share.pdfDeferred)
  }

  return (
    <article className="border-border flex min-h-[22rem] flex-col rounded-2xl border bg-white p-5 shadow-sm sm:min-h-[24rem] sm:p-6 lg:min-h-[26rem]">
      <div className="flex flex-1 flex-col">
        <h2 className="text-charcoal font-display text-lg font-semibold">
          {donorImpactContent.share.title}
        </h2>
        <p className="text-body mt-3 text-sm leading-relaxed">
          {donorImpactContent.share.description}
        </p>
      </div>

      <div className="mt-auto pt-8">
        <hr className="border-border" />

        <Button
          type="button"
          variant="outline"
          className="mt-6 w-full gap-2"
          onClick={handleDownload}
        >
          <Download aria-hidden="true" className="size-4" />
          {donorImpactContent.share.downloadPdf}
        </Button>
      </div>
    </article>
  )
}
