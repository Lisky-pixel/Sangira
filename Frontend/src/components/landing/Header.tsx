import { Button } from '@/components/ui/button'

const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Our impact', href: '#our-impact' },
  { label: 'About us', href: '#about' },
]

export function Header() {
  return (
    <header className="border-b border-sangira-green/10 bg-sangira-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
        <a
          href="/"
          className="font-serif text-2xl text-sangira-green"
        >
          Sangira
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-sangira-green/80 transition-colors hover:text-sangira-green"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button size="sm" className="hidden sm:inline-flex">
            Get started
          </Button>
          <Button variant="ghost" size="sm" className="font-medium">
            Sign in
          </Button>
        </div>
      </div>
    </header>
  )
}
