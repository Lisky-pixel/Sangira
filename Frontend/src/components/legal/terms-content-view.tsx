import { SUPPORT_EMAIL } from '../../constants/support'
import { SUPPORT_MAILTO_HREF } from '../../constants/support'
import {
  TERMS_EFFECTIVE_DATE,
  TERMS_MODAL_TITLE,
  TERMS_SECTIONS,
  termsContent,
} from '../../placeholder/terms-content'
import { cn } from '../../lib/utils'

type TermsContentViewProps = {
  className?: string
  showHeader?: boolean
}

function renderSectionBody(body: string) {
  if (body.includes(SUPPORT_EMAIL)) {
    const [before, after] = body.split(SUPPORT_EMAIL)
    return (
      <>
        {before}
        <a
          href={SUPPORT_MAILTO_HREF}
          className="text-primary font-medium hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>
        {after}
      </>
    )
  }

  return body
}

export function TermsContentView({
  className,
  showHeader = true,
}: TermsContentViewProps) {
  return (
    <article className={cn('flex flex-col', className)}>
      {showHeader ? (
        <header className="border-border shrink-0 border-b pb-4">
          <h1 className="text-charcoal font-display text-xl font-bold sm:text-2xl">
            {TERMS_MODAL_TITLE}
          </h1>
          <p className="text-body mt-1 text-sm">
            {termsContent.effectiveDateLabel(TERMS_EFFECTIVE_DATE)}
          </p>
        </header>
      ) : null}

      <ol className="mt-4 flex list-none flex-col gap-5">
        {TERMS_SECTIONS.map((section) => (
          <li key={section.heading}>
            <h2 className="text-charcoal text-sm font-semibold">
              {section.heading}
            </h2>
            <p className="text-body mt-2 text-sm leading-relaxed">
              {renderSectionBody(section.body)}
            </p>
          </li>
        ))}
      </ol>
    </article>
  )
}
