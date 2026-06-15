import { Link } from 'react-router'
import { landingFooterContent } from '../../placeholder/landing-content'
import { ROUTES } from '../../routes/paths'
import { cn } from '../../lib/utils'

const footerRouteByKey: Record<
  (typeof landingFooterContent.links)[number]['key'],
  string
> = {
  privacy: ROUTES.PRIVACY,
  terms: ROUTES.TERMS,
  help: ROUTES.HELP,
  contact: ROUTES.CONTACT,
}

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
                <Link
                  to={footerRouteByKey[link.key]}
                  className="text-body hover:text-primary text-sm transition-colors"
                >
                  {link.label}
                </Link>
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
