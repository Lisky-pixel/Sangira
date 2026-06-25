import {
  lazy,
  Suspense,
  type ComponentType,
  type ReactNode,
} from 'react'
import { RoutePageFallback } from '../components/layout/route-page-fallback'

function lazyPage(factory: () => Promise<{ default: ComponentType }>) {
  const LazyComponent = lazy(factory)

  return function LazyRoutePage() {
    return (
      <Suspense fallback={<RoutePageFallback />}>
        <LazyComponent />
      </Suspense>
    )
  }
}

function lazyNamedPage(
  factory: () => Promise<Record<string, ComponentType>>,
  exportName: string,
) {
  return lazyPage(() =>
    factory().then((module) => ({
      default: module[exportName],
    })),
  )
}

export function withRouteSuspense(children: ReactNode) {
  return <Suspense fallback={<RoutePageFallback />}>{children}</Suspense>
}

// Auth & account
export const SignInPage = lazyNamedPage(
  () => import('../pages/SignInPage'),
  'SignInPage',
)
export const ForgotPasswordPage = lazyNamedPage(
  () => import('../pages/ForgotPasswordPage'),
  'ForgotPasswordPage',
)
export const ResetPasswordPage = lazyNamedPage(
  () => import('../pages/ResetPasswordPage'),
  'ResetPasswordPage',
)
export const TransferReceiptPage = lazyNamedPage(
  () => import('../pages/TransferReceiptPage'),
  'TransferReceiptPage',
)
export const TermsPage = lazyNamedPage(
  () => import('../pages/TermsPage'),
  'TermsPage',
)
export const ComingSoonPage = lazyNamedPage(
  () => import('../pages/ComingSoon'),
  'ComingSoon',
)

// Registration
export const RegistrationWizard = lazyPage(() =>
  import('../features/registration/registration-wizard').then((module) => ({
    default: module.RegistrationWizard,
  })),
)
export const RegisterStep1Page = lazyNamedPage(
  () => import('../pages/register/RegisterStep1Page'),
  'RegisterStep1Page',
)
export const RegisterStep2Page = lazyNamedPage(
  () => import('../pages/register/RegisterStep2Page'),
  'RegisterStep2Page',
)
export const RegisterStep3Page = lazyNamedPage(
  () => import('../pages/register/RegisterStep3Page'),
  'RegisterStep3Page',
)
export const RegisterPendingPage = lazyNamedPage(
  () => import('../pages/register/RegisterPendingPage'),
  'RegisterPendingPage',
)
export const RegisterRejectedPage = lazyNamedPage(
  () => import('../pages/register/RegisterRejectedPage'),
  'RegisterRejectedPage',
)
export const VerificationApprovedPage = lazyNamedPage(
  () => import('../pages/register/VerificationApprovedPage'),
  'VerificationApprovedPage',
)

// Donor portal
export const DonorPortalLayout = lazyNamedPage(
  () => import('../components/donor/donor-portal-layout'),
  'DonorPortalLayout',
)
export const DonorComingSoon = lazyNamedPage(
  () => import('../components/donor/donor-coming-soon'),
  'DonorComingSoon',
)
export const DonorChangePasswordPage = lazyNamedPage(
  () => import('../pages/donor/DonorChangePasswordPage'),
  'DonorChangePasswordPage',
)
export const DonorDashboardPage = lazyNamedPage(
  () => import('../pages/donor/DonorDashboardPage'),
  'DonorDashboardPage',
)
export const MyListingsPage = lazyNamedPage(
  () => import('../pages/donor/MyListingsPage'),
  'MyListingsPage',
)
export const PostListingPage = lazyNamedPage(
  () => import('../pages/donor/PostListingPage'),
  'PostListingPage',
)
export const EditListingPage = lazyNamedPage(
  () => import('../pages/donor/EditListingPage'),
  'EditListingPage',
)
export const DonorHandoverPage = lazyNamedPage(
  () => import('../pages/donor/DonorHandoverPage'),
  'DonorHandoverPage',
)
export const ManageListingPage = lazyNamedPage(
  () => import('../pages/donor/ManageListingPage'),
  'ManageListingPage',
)
export const DonorActivityPage = lazyNamedPage(
  () => import('../pages/donor/DonorActivityPage'),
  'DonorActivityPage',
)
export const DonorImpactPage = lazyNamedPage(
  () => import('../pages/donor/DonorImpactPage'),
  'DonorImpactPage',
)
export const DonorProfilePage = lazyNamedPage(
  () => import('../pages/donor/DonorProfilePage'),
  'DonorProfilePage',
)
export const DonorSettingsPage = lazyNamedPage(
  () => import('../pages/donor/DonorSettingsPage'),
  'DonorSettingsPage',
)

// NGO portal
export const NgoPortalLayout = lazyNamedPage(
  () => import('../components/ngo/ngo-portal-layout'),
  'NgoPortalLayout',
)
export const NgoComingSoon = lazyNamedPage(
  () => import('../components/ngo/ngo-coming-soon'),
  'NgoComingSoon',
)
export const NgoChangePasswordPage = lazyNamedPage(
  () => import('../pages/ngo/NgoChangePasswordPage'),
  'NgoChangePasswordPage',
)
export const NgoDashboardPage = lazyNamedPage(
  () => import('../pages/ngo/NgoDashboardPage'),
  'NgoDashboardPage',
)
export const NgoBrowseListingsPage = lazyNamedPage(
  () => import('../pages/ngo/NgoBrowseListingsPage'),
  'NgoBrowseListingsPage',
)
export const NgoMyRequestsPage = lazyNamedPage(
  () => import('../pages/ngo/NgoMyRequestsPage'),
  'NgoMyRequestsPage',
)
export const NgoConfirmPickupPage = lazyNamedPage(
  () => import('../pages/ngo/NgoConfirmPickupPage'),
  'NgoConfirmPickupPage',
)
export const NgoCapacityPage = lazyNamedPage(
  () => import('../pages/ngo/NgoCapacityPage'),
  'NgoCapacityPage',
)
export const NgoProfilePage = lazyNamedPage(
  () => import('../pages/ngo/NgoProfilePage'),
  'NgoProfilePage',
)
export const NgoSettingsPage = lazyNamedPage(
  () => import('../pages/ngo/NgoSettingsPage'),
  'NgoSettingsPage',
)
export const NgoListingDetailPage = lazyNamedPage(
  () => import('../pages/ngo/NgoListingDetailPage'),
  'NgoListingDetailPage',
)

// Admin portal
export const AdminSignInPage = lazyNamedPage(
  () => import('../pages/admin/AdminSignInPage'),
  'AdminSignInPage',
)
export const AdminProtectedLayout = lazyNamedPage(
  () => import('../pages/admin/AdminProtectedLayout'),
  'AdminProtectedLayout',
)
export const AdminOverviewPage = lazyNamedPage(
  () => import('../pages/admin/AdminOverviewPage'),
  'AdminOverviewPage',
)
export const AdminActivityPage = lazyNamedPage(
  () => import('../pages/admin/AdminActivityPage'),
  'AdminActivityPage',
)
export const AdminVerificationsPage = lazyNamedPage(
  () => import('../pages/admin/AdminVerificationsPage'),
  'AdminVerificationsPage',
)
export const AdminUsersPage = lazyNamedPage(
  () => import('../pages/admin/AdminUsersPage'),
  'AdminUsersPage',
)
export const AdminListingsPage = lazyNamedPage(
  () => import('../pages/admin/AdminListingsPage'),
  'AdminListingsPage',
)
export const AdminReportsPage = lazyNamedPage(
  () => import('../pages/admin/AdminReportsPage'),
  'AdminReportsPage',
)
export const AdminReportsDonorsPage = lazyNamedPage(
  () => import('../pages/admin/AdminReportsDonorsPage'),
  'AdminReportsDonorsPage',
)
export const AdminReportsNgosPage = lazyNamedPage(
  () => import('../pages/admin/AdminReportsNgosPage'),
  'AdminReportsNgosPage',
)
export const AdminProfilePage = lazyNamedPage(
  () => import('../pages/admin/AdminProfilePage'),
  'AdminProfilePage',
)
export const AdminChangePasswordPage = lazyNamedPage(
  () => import('../pages/admin/AdminChangePasswordPage'),
  'AdminChangePasswordPage',
)
export const AdminSettingsPage = lazyNamedPage(
  () => import('../pages/admin/AdminSettingsPage'),
  'AdminSettingsPage',
)
