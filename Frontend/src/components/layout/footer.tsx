import { Link } from 'react-router'
import { SUPPORT_MAILTO_HREF } from '../../constants/support'
import { landingFooterContent } from '../../placeholder/landing-content'
import { ROUTES } from '../../routes/paths'
import { cn } from '../../lib/utils'

const footerLinkClassName = 'text-body hover:text-primary text-sm transition-colors'

const footerRouteByKey: Record<
  Extract<(typeof landingFooterContent.links)[number]['key'], 'privacy' | 'terms'>,
  string
> = {
  privacy: ROUTES.PRIVACY,
  terms: ROUTES.TERMS,
}

const supportFooterKeys = new Set(['help', 'contact'])

type FooterProps = {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t border-border bg-cream', className)}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:text-left lg:px-8">
        <Link
          to={ROUTES.HOME}
          className="text-primary font-display text-lg font-bold"
        >
          {landingFooterContent.brand}
        </Link>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {landingFooterContent.links.map((link) => (
              <li key={link.key}>
                {supportFooterKeys.has(link.key) ? (
                  <a
                    href={SUPPORT_MAILTO_HREF}
                    className={footerLinkClassName}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={footerRouteByKey[link.key as 'privacy' | 'terms']}
                    className={footerLinkClassName}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-body text-sm lg:text-right">
          {landingFooterContent.copyright}
        </p>
      </div>
    </footer>
  )
}
