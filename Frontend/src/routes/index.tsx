import { createBrowserRouter, Navigate } from 'react-router'
import { ComingSoon } from '../pages/ComingSoon'
import { LandingPage } from '../pages/LandingPage'
import { RegisterStep1Page } from '../pages/RegisterStep1Page'
import { COMING_SOON_PATHS, ROUTES } from './paths'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterStep1Page />,
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
