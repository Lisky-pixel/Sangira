import { Link } from 'react-router'
import { headerMinimalContent } from '../../placeholder/register-content'
import { pendingVerificationContent } from '../../placeholder/pending-verification-content'
import { ROUTES } from '../../routes/paths'
import { cn } from '../../lib/utils'

type HeaderMinimalProps = {
  className?: string
  variant?: 'default' | 'authed'
  onSignOut?: () => void
}

export function HeaderMinimal({
  className,
  variant = 'default',
  onSignOut,
}: HeaderMinimalProps) {
  return (
    <header className={cn('border-b border-border bg-cream', className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.HOME}
          className="text-primary font-display shrink-0 text-lg font-bold sm:text-xl"
        >
          {headerMinimalContent.brand}
        </Link>

        {variant === 'authed' ? (
          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <Link
              to={ROUTES.HELP}
              className="text-body hover:text-primary text-sm transition-colors"
            >
              {headerMinimalContent.needHelpLabel}
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="text-body hover:text-primary text-sm transition-colors"
            >
              {pendingVerificationContent.signOutLabel}
            </button>
          </div>
        ) : (
          <Link
            to={ROUTES.HELP}
            className="text-body hover:text-primary shrink-0 text-sm transition-colors"
          >
            {headerMinimalContent.needHelpLabel}
          </Link>
        )}
      </div>
    </header>
  )
}
