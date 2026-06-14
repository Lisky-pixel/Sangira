const footerLinks = [
  'Privacy Policy',
  'Terms of Service',
  'Contact us',
  'Partner Organizations',
]

export function Footer() {
  return (
    <footer className="border-t border-sangira-green/10 bg-sangira-beige">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 text-sm text-sangira-muted lg:flex-row lg:px-8">
        <a href="/" className="font-serif text-xl text-sangira-green">
          Sangira
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="transition-colors hover:text-sangira-green"
            >
              {link}
            </a>
          ))}
        </nav>

        <p className="text-center lg:text-right">
          © 2024 Sangira Food Redistribution.
        </p>
      </div>
    </footer>
  )
}
