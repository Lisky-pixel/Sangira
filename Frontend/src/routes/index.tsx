import { createBrowserRouter } from 'react-router'
import { ComingSoon } from '../pages/ComingSoon'
import { LandingPage } from '../pages/LandingPage'
import { COMING_SOON_PATHS, ROUTES } from './paths'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },
  ...COMING_SOON_PATHS.map((path) => ({
    path,
    element: <ComingSoon />,
  })),
])
