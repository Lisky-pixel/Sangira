import { useId } from 'react'
import { Link, useNavigate } from 'react-router'
import { RoleSelectionGroup } from '../../components/register/role-selection-group'
import { Button } from '../../components/ui/button'
import { registerStep1Content } from '../../placeholder/register-content'
import { ROUTES } from '../../routes/paths'
import type { UserRole } from '../../constants/registration-roles'
import { useRegistration } from '../../features/registration'

export function RegisterStep1Page() {
  const headingId = useId()
  const navigate = useNavigate()
  const { state, dispatch } = useRegistration()

  const handleSelectRole = (role: UserRole) => {
    dispatch({ type: 'SET_ROLE', role })
  }

  const handleContinue = () => {
    if (!state.role) return
    navigate(`${ROUTES.REGISTER}/details`)
  }

  return (
    <>
      <h1
        id={headingId}
        className="text-charcoal font-display mb-6 text-2xl font-bold sm:text-3xl"
      >
        {registerStep1Content.heading}
      </h1>

      <RoleSelectionGroup
        value={state.role}
        onChange={handleSelectRole}
        headingId={headingId}
      />

      <Button
        type="button"
        className="mt-6 w-full"
        disabled={state.role === null}
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
    </>
  )
}
