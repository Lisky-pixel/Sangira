import { createBrowserRouter, Navigate } from 'react-router'
import { RegistrationWizard } from '../features/registration'
import { ComingSoon } from '../pages/ComingSoon'
import { LandingPage } from '../pages/LandingPage'
import { RegisterStep1Page } from '../pages/register/RegisterStep1Page'
import { RegisterStep2Page } from '../pages/register/RegisterStep2Page'
import { RegisterStep3Page } from '../pages/register/RegisterStep3Page'
import { COMING_SOON_PATHS, ROUTES } from './paths'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
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
    path: ROUTES.GET_STARTED_LEGACY,
    element: <Navigate replace to={ROUTES.REGISTER} />,
  },
  ...COMING_SOON_PATHS.map((path) => ({
    path,
    element: <ComingSoon />,
  })),
])
