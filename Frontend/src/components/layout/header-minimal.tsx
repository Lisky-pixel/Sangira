import { Link } from 'react-router'
import { headerMinimalContent } from '../../placeholder/register-content'
import { ROUTES } from '../../routes/paths'
import { cn } from '../../lib/utils'

type HeaderMinimalProps = {
  className?: string
}

export function HeaderMinimal({ className }: HeaderMinimalProps) {
  return (
    <header className={cn('border-b border-border bg-cream', className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.HOME}
          className="text-primary font-display shrink-0 text-lg font-bold sm:text-xl"
        >
          {headerMinimalContent.brand}
        </Link>
        <Link
          to={ROUTES.HELP}
          className="text-body hover:text-primary shrink-0 text-sm transition-colors"
        >
          {headerMinimalContent.needHelpLabel}
        </Link>
      </div>
    </header>
  )
}
