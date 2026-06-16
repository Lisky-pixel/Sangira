import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router'
import { Footer } from '../../components/layout/footer'
import { HeaderMinimal } from '../../components/layout/header-minimal'
import { RegisterStep1Reassurance } from '../../components/register/register-step1-reassurance'
import { isUserRole } from '../../constants/registration-roles'
import { ROUTES } from '../../routes/paths'
import {
  getPreviousRegistrationStepPath,
  getRegistrationStepFromPathname,
  REGISTRATION_TOTAL_STEPS,
} from './constants'
import { RegistrationProvider } from './registration-provider'
import { useRegistration } from './use-registration'
import { RegistrationStepHeader } from './registration-step-header'

function RegistrationWizardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { dispatch } = useRegistration()
  const hasSeededRole = useRef(false)

  const currentStep = getRegistrationStepFromPathname(location.pathname)
  const isStep1 = currentStep === 1

  useEffect(() => {
    if (hasSeededRole.current) return

    const roleParam = searchParams.get('role')
    if (isUserRole(roleParam)) {
      dispatch({ type: 'SET_ROLE', role: roleParam })
    }

    hasSeededRole.current = true

    if (searchParams.has('role')) {
      navigate({ pathname: location.pathname, search: '' }, { replace: true })
    }
  }, [dispatch, location.pathname, navigate, searchParams])

  const handleBack = () => {
    const previousPath = getPreviousRegistrationStepPath(currentStep)
    const target =
      previousPath === ''
        ? ROUTES.REGISTER
        : `${ROUTES.REGISTER}/${previousPath}`
    navigate(target)
  }

  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <HeaderMinimal />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <RegistrationStepHeader
            currentStep={currentStep}
            onBack={currentStep > 1 ? handleBack : undefined}
          />
          <Outlet />
        </div>

        {isStep1 ? <RegisterStep1Reassurance className="mt-8" /> : null}
      </main>

      <Footer />
    </div>
  )
}

export function RegistrationWizard() {
  return (
    <RegistrationProvider>
      <RegistrationWizardLayout />
    </RegistrationProvider>
  )
}

export { REGISTRATION_TOTAL_STEPS }
