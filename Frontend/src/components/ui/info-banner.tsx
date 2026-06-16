import { Info, Shield } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type InfoBannerVariant = 'info' | 'neutral'

type InfoBannerProps = {
  variant: InfoBannerVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<
  InfoBannerVariant,
  { container: string; icon: string; Icon: typeof Info }
> = {
  info: {
    container: 'bg-sand',
    icon: 'text-primary',
    Icon: Shield,
  },
  neutral: {
    container: 'bg-sand',
    icon: 'text-primary',
    Icon: Info,
  },
}

export function InfoBanner({ variant, children, className }: InfoBannerProps) {
  const { container, icon, Icon } = variantStyles[variant]

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg p-4',
        container,
        className,
      )}
    >
      <Icon aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0', icon)} />
      <p className="text-body text-sm leading-relaxed">{children}</p>
    </div>
  )
}
