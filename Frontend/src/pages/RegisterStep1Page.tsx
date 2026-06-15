import { Shield, ShieldCheck } from 'lucide-react'
import { useId, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Footer } from '../components/layout/footer'
import { HeaderMinimal } from '../components/layout/header-minimal'
import { RoleSelectionGroup } from '../components/register/role-selection-group'
import { Button } from '../components/ui/button'
import { StepPill } from '../components/ui/step-pill'
import { isUserRole } from '../constants/registration-roles'
import { registerStep1Content } from '../placeholder/register-content'
import { registerDetailsPath, ROUTES } from '../routes/paths'
import type { UserRole } from '../constants/registration-roles'

const reassuranceIcons = {
  shield: Shield,
  'shield-check': ShieldCheck,
} as const

const REGISTRATION_TOTAL_STEPS = 3

function parseInitialRole(searchParams: URLSearchParams): UserRole | null {
  const role = searchParams.get('role')
  return isUserRole(role) ? role : null
}

export function RegisterStep1Page() {
  const headingId = useId()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(() =>
    parseInitialRole(searchParams),
  )

  const handleContinue = () => {
    if (!selectedRole) return
    navigate(registerDetailsPath(selectedRole))
  }

  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <HeaderMinimal />

      {/* TODO: wrap Steps 1–3 in a shared multi-step registration form container */}
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <StepPill
            step={1}
            total={REGISTRATION_TOTAL_STEPS}
            className="mb-6"
          />

          <h1
            id={headingId}
            className="text-charcoal font-display mb-6 text-2xl font-bold sm:text-3xl"
          >
            {registerStep1Content.heading}
          </h1>

          <RoleSelectionGroup
            value={selectedRole}
            onChange={setSelectedRole}
            headingId={headingId}
          />

          <Button
            type="button"
            className="mt-6 w-full"
            disabled={selectedRole === null}
            onClick={handleContinue}
          >
            {registerStep1Content.continueLabel}
          </Button>

          <p className="text-body mt-4 text-center text-sm">
            {registerStep1Content.alreadyRegisteredPrefix}{' '}
            <Link
              to={ROUTES.SIGN_IN}
              className="text-primary font-medium hover:underline"
            >
              {registerStep1Content.signInLink}
            </Link>
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:gap-8">
          {registerStep1Content.reassurance.map((item) => {
            const Icon = reassuranceIcons[item.icon]

            return (
              <div
                key={item.text}
                className="text-body flex flex-1 items-start gap-2 text-sm"
              >
                <Icon
                  aria-hidden="true"
                  className="text-status-neutral mt-0.5 size-4 shrink-0"
                />
                <p>{item.text}</p>
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
