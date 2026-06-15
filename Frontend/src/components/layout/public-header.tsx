import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { landingHeaderContent } from '../../placeholder/landing-content'
import { LANDING_ANCHORS, ROUTES } from '../../routes/paths'
import { cn } from '../../lib/utils'
import { ButtonLink } from '../ui/button'
import { HeaderZigzagBorder } from './header-zigzag-border'

type PublicHeaderProps = {
  className?: string
}

const anchorHrefByLabel: Record<string, string> = {
  'How it works': LANDING_ANCHORS.HOW_IT_WORKS,
  'Our impact': LANDING_ANCHORS.IMPACT,
  'About us': LANDING_ANCHORS.ABOUT,
}

function NavLinks({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  return (
    <ul
      className={cn(
        'flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8',
        className,
      )}
    >
      {landingHeaderContent.navLinks.map((link) => (
        <li key={link.label}>
          <a
            href={anchorHrefByLabel[link.label] ?? link.href}
            className="text-charcoal hover:text-primary text-sm font-medium transition-colors"
            onClick={onNavigate}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function HeaderActions({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4',
        className,
      )}
    >
      <ButtonLink to={ROUTES.GET_STARTED} onClick={onNavigate}>
        {landingHeaderContent.getStartedLabel}
      </ButtonLink>
      <ButtonLink to={ROUTES.SIGN_IN} variant="ghost" onClick={onNavigate}>
        {landingHeaderContent.signInLabel}
      </ButtonLink>
    </div>
  )
}

export function PublicHeader({ className }: PublicHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobileMenu = () => setMobileOpen(false)

  return (
    <header className={cn('relative bg-white', className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.HOME}
          className="text-primary font-display shrink-0 text-xl font-bold"
        >
          {landingHeaderContent.brand}
        </Link>

        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
          <NavLinks />
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <HeaderActions />
        </div>

        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="text-charcoal hover:text-primary lg:hidden"
              aria-label="Open menu"
            >
              <Menu aria-hidden="true" className="size-6" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden" />
            <Dialog.Content
              className={cn(
                'fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-8 bg-white px-6 py-8 shadow-lg',
                'focus:outline-none lg:hidden',
              )}
            >
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-charcoal font-display text-lg font-bold">
                  Menu
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="text-charcoal hover:text-primary"
                    aria-label="Close menu"
                  >
                    <X aria-hidden="true" className="size-6" />
                  </button>
                </Dialog.Close>
              </div>

              <Dialog.Description className="sr-only">
                Mobile navigation links and actions
              </Dialog.Description>

              <NavLinks onNavigate={closeMobileMenu} />
              <HeaderActions onNavigate={closeMobileMenu} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <HeaderZigzagBorder />
    </header>
  )
}
