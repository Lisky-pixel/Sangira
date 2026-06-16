import { AlertCircle, Check, FileText } from 'lucide-react'
import { pendingVerificationImages } from '../../placeholder/pending-verification-images'
import { cn } from '../../lib/utils'

export type VerificationBannerVariant = 'pending' | 'rejected' | 'verified'

const badgeConfig: Record<
  VerificationBannerVariant,
  { Icon: typeof FileText; className: string }
> = {
  pending: {
    Icon: FileText,
    className: 'text-primary size-7 sm:size-8',
  },
  rejected: {
    Icon: AlertCircle,
    className: 'text-clay-red size-7 sm:size-8',
  },
  verified: {
    Icon: Check,
    className: 'text-stat size-8 sm:size-9',
  },
}

type VerificationBannerProps = {
  className?: string
  variant?: VerificationBannerVariant
}

export function VerificationBanner({
  className,
  variant = 'pending',
}: VerificationBannerProps) {
  const { Icon, className: iconClassName } = badgeConfig[variant]

  return (
    <div
      className={cn(
        'border-border relative overflow-hidden bg-cream',
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
          <Icon
            aria-hidden="true"
            className={iconClassName}
            strokeWidth={variant === 'verified' ? 3 : 2}
          />
        </div>
      </div>
    </div>
  )
}
