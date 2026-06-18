import { Link } from 'react-router'
import { ROUTES } from '../../routes/paths'
import { donorChangePasswordContent } from '../../placeholder/donor-change-password-content'

export function DonorChangePasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
        {donorChangePasswordContent.pageTitle}
      </h1>
      <p className="text-body text-sm">{donorChangePasswordContent.comingSoon}</p>
      <Link
        to={ROUTES.DONOR_PROFILE}
        className="text-primary text-sm font-medium hover:underline"
      >
        {donorChangePasswordContent.backToProfile}
      </Link>
    </div>
  )
}
