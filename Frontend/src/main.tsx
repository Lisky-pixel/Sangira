import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { router } from './routes'
import './index.css'
import './styles/sonner-overrides.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster
      className="sangira-toaster"
      richColors
      position="top-right"
      closeButton
      toastOptions={{ closeButtonAriaLabel: 'Dismiss' }}
    />
  </StrictMode>,
)
