import { Download } from 'lucide-react'
import type { DonorImpactSummary } from '../../types/donor-impact'
import { donorImpactContent } from '../../placeholder/donor-impact-content'
import { exportContent } from '../../placeholder/export-content'
import { toast } from '../../lib/toast'
import { Button } from '../ui/button'

type DonorImpactShareCardProps = {
  organisationName: string
  impact: DonorImpactSummary
}

export function DonorImpactShareCard({
  organisationName,
  impact,
}: DonorImpactShareCardProps) {
  const handleDownload = () => {
    void toast.promise(
      import('../../lib/export/donor-impact-pdf-export').then((module) =>
        module.exportDonorImpactPdf({ organisationName, impact }),
      ),
      {
        loading: exportContent.toast.donorPdf.loading,
        success: exportContent.toast.donorPdf.success,
        error: exportContent.toast.donorPdf.error,
      },
    )
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
