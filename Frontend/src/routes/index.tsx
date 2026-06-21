import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import {
  AuthProvider,
  RequireAuth,
  RequireRole,
  RequireVerification,
  VerificationStatusGate,
} from '../auth'
import { DonorComingSoon, DonorPortalLayout } from '../components/donor'
import { DonorHandoverPage } from '../pages/donor/DonorHandoverPage'
import { NgoComingSoon, NgoPortalLayout } from '../components/ngo'
import { VERIFICATION_STATUS } from '../constants/verification-status'
import { RegistrationWizard } from '../features/registration'
import { TermsPage } from '../pages/TermsPage'
import { ComingSoon } from '../pages/ComingSoon'
import { DonorDashboardPage } from '../pages/donor/DonorDashboardPage'
import { DonorImpactPage } from '../pages/donor/DonorImpactPage'
import { DonorActivityPage } from '../pages/donor/DonorActivityPage'
import { DonorChangePasswordPage } from '../pages/donor/DonorChangePasswordPage'
import { DonorProfilePage } from '../pages/donor/DonorProfilePage'
import { DonorSettingsPage } from '../pages/donor/DonorSettingsPage'
import { EditListingPage } from '../pages/donor/EditListingPage'
import { ManageListingPage } from '../pages/donor/ManageListingPage'
import { MyListingsPage } from '../pages/donor/MyListingsPage'
import { PostListingPage } from '../pages/donor/PostListingPage'
import { NgoBrowseListingsPage } from '../pages/ngo/NgoBrowseListingsPage'
import { NgoChangePasswordPage } from '../pages/ngo/NgoChangePasswordPage'
import { NgoConfirmPickupPage } from '../pages/ngo/NgoConfirmPickupPage'
import { NgoCapacityPage } from '../pages/ngo/NgoCapacityPage'
import { NgoDashboardPage } from '../pages/ngo/NgoDashboardPage'
import { NgoListingDetailPage } from '../pages/ngo/NgoListingDetailPage'
import { NgoMyRequestsPage } from '../pages/ngo/NgoMyRequestsPage'
import { NgoProfilePage } from '../pages/ngo/NgoProfilePage'
import { NgoSettingsPage } from '../pages/ngo/NgoSettingsPage'
import { LandingPage } from '../pages/LandingPage'
import { SignInPage } from '../pages/SignInPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { TransferReceiptPage } from '../pages/TransferReceiptPage'
import { RegisterStep1Page } from '../pages/register/RegisterStep1Page'
import { RegisterStep2Page } from '../pages/register/RegisterStep2Page'
import { RegisterStep3Page } from '../pages/register/RegisterStep3Page'
import { RegisterPendingPage } from '../pages/register/RegisterPendingPage'
import { RegisterRejectedPage } from '../pages/register/RegisterRejectedPage'
import { VerificationApprovedPage } from '../pages/register/VerificationApprovedPage'
import { AdminActivityPage } from '../pages/admin/AdminActivityPage'
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage'
import { AdminVerificationsPage } from '../pages/admin/AdminVerificationsPage'
import { AdminListingsPage } from '../pages/admin/AdminListingsPage'
import { AdminProfilePage } from '../pages/admin/AdminProfilePage'
import { AdminChangePasswordPage } from '../pages/admin/AdminChangePasswordPage'
import { AdminReportsPage } from '../pages/admin/AdminReportsPage'
import { AdminReportsDonorsPage } from '../pages/admin/AdminReportsDonorsPage'
import { AdminReportsNgosPage } from '../pages/admin/AdminReportsNgosPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { AdminProtectedLayout } from '../pages/admin/AdminProtectedLayout'
import { AdminSignInPage } from '../pages/admin/AdminSignInPage'
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
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: <ResetPasswordPage />,
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
        path: ROUTES.TRANSFER_RECEIPT,
        element: (
          <RequireAuth>
            <TransferReceiptPage />
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.DONOR_CHANGE_PASSWORD,
        element: (
          <RequireAuth>
            <DonorChangePasswordPage />
          </RequireAuth>
        ),
      },
      {
        path: '/donor/change-password',
        element: <Navigate replace to={ROUTES.DONOR_CHANGE_PASSWORD} />,
      },
      {
        path: ROUTES.DONOR_DASHBOARD_LEGACY,
        element: <Navigate replace to={ROUTES.DONOR_DASHBOARD} />,
      },
      {
        path: '/donor',
        element: (
          <RequireAuth>
            <RequireVerification>
              <RequireRole role="donor">
                <DonorPortalLayout />
              </RequireRole>
            </RequireVerification>
          </RequireAuth>
        ),
        children: [
          {
            path: 'dashboard',
            element: <DonorDashboardPage />,
          },
          {
            path: 'listings',
            element: <MyListingsPage />,
          },
          {
            path: 'listings/new',
            element: <PostListingPage />,
          },
          {
            path: 'listings/:id/edit',
            element: <EditListingPage />,
          },
          {
            path: 'listings/:id/handover',
            element: <DonorHandoverPage />,
          },
          {
            path: 'listings/:id',
            element: <ManageListingPage />,
          },
          {
            path: 'requests/:id',
            element: <DonorComingSoon />,
          },
          {
            path: 'activity',
            element: <DonorActivityPage />,
          },
          {
            path: 'impact',
            element: <DonorImpactPage />,
          },
          {
            path: 'profile',
            element: <DonorProfilePage />,
          },
          {
            path: 'settings',
            element: <DonorSettingsPage />,
          },
          {
            path: 'notifications',
            element: <DonorComingSoon />,
          },
        ],
      },
      {
        path: ROUTES.NGO_CHANGE_PASSWORD,
        element: (
          <RequireAuth>
            <RequireRole role="ngo">
              <NgoChangePasswordPage />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: '/ngo/change-password',
        element: <Navigate replace to={ROUTES.NGO_CHANGE_PASSWORD} />,
      },
      {
        path: ROUTES.NGO_PORTAL_LEGACY,
        element: <Navigate replace to={ROUTES.NGO_DASHBOARD} />,
      },
      {
        path: '/ngo',
        element: (
          <RequireAuth>
            <RequireVerification>
              <RequireRole role="ngo">
                <NgoPortalLayout />
              </RequireRole>
            </RequireVerification>
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <Navigate replace to={ROUTES.NGO_DASHBOARD} />,
          },
          {
            path: 'dashboard',
            element: <NgoDashboardPage />,
          },
          {
            path: 'browse',
            element: <NgoBrowseListingsPage />,
          },
          {
            path: 'requests',
            element: <NgoMyRequestsPage />,
          },
          {
            path: 'requests/:id/confirm',
            element: <NgoConfirmPickupPage />,
          },
          {
            path: 'capacity',
            element: <NgoCapacityPage />,
          },
          {
            path: 'profile',
            element: <NgoProfilePage />,
          },
          {
            path: 'settings',
            element: <NgoSettingsPage />,
          },
          {
            path: 'notifications',
            element: <NgoComingSoon />,
          },
          {
            path: 'listings/:id',
            element: <NgoListingDetailPage />,
          },
        ],
      },
      {
        path: ROUTES.ADMIN_LOGIN,
        element: <AdminSignInPage />,
      },
      {
        path: '/admin',
        element: <AdminProtectedLayout />,
        children: [
          {
            index: true,
            element: <AdminOverviewPage />,
          },
          {
            path: 'activity',
            element: <AdminActivityPage />,
          },
          {
            path: 'verifications',
            element: <AdminVerificationsPage />,
          },
          {
            path: 'users',
            element: <AdminUsersPage />,
          },
          {
            path: 'listings',
            element: <AdminListingsPage />,
          },
          {
            path: 'reports',
            element: <AdminReportsPage />,
          },
          {
            path: 'reports/donors',
            element: <AdminReportsDonorsPage />,
          },
          {
            path: 'reports/ngos',
            element: <AdminReportsNgosPage />,
          },
          {
            path: 'profile',
            element: <AdminProfilePage />,
          },
          {
            path: 'profile/change-password',
            element: <AdminChangePasswordPage />,
          },
          {
            path: 'settings',
            element: <AdminSettingsPage />,
          },
        ],
      },
      {
        path: ROUTES.GET_STARTED_LEGACY,
        element: <Navigate replace to={ROUTES.REGISTER} />,
      },
      {
        path: ROUTES.TERMS,
        element: <TermsPage />,
      },
      {
        path: ROUTES.PRIVACY,
        element: <TermsPage />,
      },
      ...COMING_SOON_PATHS.map((path) => ({
        path,
        element: <ComingSoon />,
      })),
    ],
  },
])
