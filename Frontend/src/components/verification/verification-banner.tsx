import { FileText } from 'lucide-react'
import { pendingVerificationImages } from '../../placeholder/pending-verification-images'
import { cn } from '../../lib/utils'

type VerificationBannerProps = {
  className?: string
}

export function VerificationBanner({ className }: VerificationBannerProps) {
  return (
    <div
      className={cn(
        'border-border relative overflow-hidden rounded-xl border bg-cream',
        className,
      )}
    >
      <img
        src={pendingVerificationImages.banner}
        alt=""
        aria-hidden="true"
        className="aspect-[16/9] w-full object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm sm:size-16">
          <FileText aria-hidden="true" className="text-primary size-7 sm:size-8" />
        </div>
      </div>
    </div>
  )
}
