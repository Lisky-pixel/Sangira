import { RequireAdminAuth, RequireRole } from '../../auth'
import { AdminPortalLayout } from '../../components/admin'

export function AdminProtectedLayout() {
  return (
    <RequireAdminAuth>
      <RequireRole role="admin">
        <AdminPortalLayout />
      </RequireRole>
    </RequireAdminAuth>
  )
}
