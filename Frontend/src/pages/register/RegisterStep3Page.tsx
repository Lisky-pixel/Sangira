import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useRegistration } from '../../features/registration'
import { registerStep3Content } from '../../placeholder/register-content'
import { ROUTES } from '../../routes/paths'

/** TEMPORARY — Step 3 document upload and final submit come in a later task. */
export function RegisterStep3Page() {
  const navigate = useNavigate()
  const { state } = useRegistration()

  useEffect(() => {
    if (!state.role) {
      navigate(ROUTES.REGISTER, { replace: true })
      return
    }

    if (!state.organisationName || !state.email) {
      navigate(`${ROUTES.REGISTER}/details`, { replace: true })
    }
  }, [navigate, state.email, state.organisationName, state.role])

  return (
    <div className="text-center">
      <h1 className="text-charcoal font-display mb-2 text-2xl font-bold">
        {registerStep3Content.heading}
      </h1>
      <p className="text-body mb-4 text-sm">{registerStep3Content.subcopy}</p>
      <p className="text-body text-sm italic">
        {registerStep3Content.placeholderNote}
      </p>
    </div>
  )
}
