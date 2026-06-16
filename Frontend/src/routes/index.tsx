import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { AuthProvider, RequireAuth, VerificationStatusGate } from '../auth'
import { VERIFICATION_STATUS } from '../constants/verification-status'
import { RegistrationWizard } from '../features/registration'
import { ComingSoon } from '../pages/ComingSoon'
import { LandingPage } from '../pages/LandingPage'
import { SignInPage } from '../pages/SignInPage'
import { RegisterStep1Page } from '../pages/register/RegisterStep1Page'
import { RegisterStep2Page } from '../pages/register/RegisterStep2Page'
import { RegisterStep3Page } from '../pages/register/RegisterStep3Page'
import { RegisterPendingPage } from '../pages/register/RegisterPendingPage'
import { RegisterRejectedPage } from '../pages/register/RegisterRejectedPage'
import { VerificationApprovedPage } from '../pages/register/VerificationApprovedPage'
import { COMING_SOON_PATHS, ROUTES } from './paths'

export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: ROUTES.HOME,
        element: <LandingPage />,
      },
      {
        path: ROUTES.SIGN_IN,
        element: <SignInPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegistrationWizard />,
        children: [
          {
            index: true,
            element: <RegisterStep1Page />,
          },
          {
            path: 'details',
            element: <RegisterStep2Page />,
          },
          {
            path: 'documents',
            element: <RegisterStep3Page />,
          },
        ],
      },
      {
        path: ROUTES.REGISTER_PENDING,
        element: (
          <RequireAuth>
            <VerificationStatusGate allowed={[VERIFICATION_STATUS.PENDING]}>
              <RegisterPendingPage />
            </VerificationStatusGate>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.REGISTER_REJECTED,
        element: (
          <RequireAuth>
            <VerificationStatusGate allowed={[VERIFICATION_STATUS.REJECTED]}>
              <RegisterRejectedPage />
            </VerificationStatusGate>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.VERIFICATION_APPROVED,
        element: (
          <RequireAuth>
            <VerificationStatusGate allowed={[VERIFICATION_STATUS.APPROVED]}>
              <VerificationApprovedPage />
            </VerificationStatusGate>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.DONOR_DASHBOARD,
        element: (
          <RequireAuth>
            <VerificationStatusGate allowed={[VERIFICATION_STATUS.APPROVED]}>
              {/* TEMPORARY — replace with donor portal dashboard */}
              <ComingSoon />
            </VerificationStatusGate>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.NGO_DASHBOARD,
        element: (
          <RequireAuth>
            <VerificationStatusGate allowed={[VERIFICATION_STATUS.APPROVED]}>
              {/* TEMPORARY — replace with NGO portal dashboard */}
              <ComingSoon />
            </VerificationStatusGate>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.GET_STARTED_LEGACY,
        element: <Navigate replace to={ROUTES.REGISTER} />,
      },
      ...COMING_SOON_PATHS.map((path) => ({
        path,
        element: <ComingSoon />,
      })),
    ],
  },
])
