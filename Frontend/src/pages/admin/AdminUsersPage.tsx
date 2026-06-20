import { useCallback, useEffect, useState } from 'react'
import {
  ADMIN_USER_LIST_ROLE_FILTER,
  ADMIN_USER_LIST_STATUS_FILTER,
  ADMIN_USERS_PAGE,
  type AdminUserListRoleFilter,
  type AdminUserListStatusFilter,
} from '../../constants/admin-users'
import { adminUserDetailToListItem } from '../../lib/admin-user-list'
import { toast } from '../../lib/toast'
import { adminUsersContent } from '../../placeholder/admin-users-content'
import { ApiError } from '../../services/api-error'
import { adminPortalService } from '../../services/admin-portal-service'
import type { AdminUserDetail, AdminUserListItem } from '../../types/admin-users'
import { AdminUserFlagModal } from '../../components/admin/admin-user-flag-modal'
import { AdminUserProfilePanel } from '../../components/admin/admin-user-profile-panel'
import { AdminUserReactivateModal } from '../../components/admin/admin-user-reactivate-modal'
import { AdminUserRevokeModal } from '../../components/admin/admin-user-revoke-modal'
import { AdminUserRestoreModal } from '../../components/admin/admin-user-restore-modal'
import { AdminUserSuspendModal } from '../../components/admin/admin-user-suspend-modal'
import { AdminUsersFilters } from '../../components/admin/admin-users-filters'
import { AdminUsersTable } from '../../components/admin/admin-users-table'
import { VerificationQueuePager } from '../../components/admin/verification-queue-pager'

const SEARCH_DEBOUNCE_MS = 300

type ActiveAction =
  | { type: 'flag'; user: AdminUserListItem }
  | { type: 'suspend'; user: AdminUserListItem }
  | { type: 'reactivate'; user: AdminUserListItem }
  | { type: 'revoke'; user: AdminUserListItem }
  | { type: 'restore'; user: AdminUserListItem }
  | null

export function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<AdminUserListRoleFilter>(
    ADMIN_USER_LIST_ROLE_FILTER.ALL,
  )
  const [statusFilter, setStatusFilter] = useState<AdminUserListStatusFilter>(
    ADMIN_USER_LIST_STATUS_FILTER.ALL,
  )
  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelDetail, setPanelDetail] = useState<AdminUserDetail | null>(null)
  const [activeAction, setActiveAction] = useState<ActiveAction>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim())
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoadState('loading')
      try {
        const result = await adminPortalService.listUsers({
          page,
          pageSize: ADMIN_USERS_PAGE.PAGE_SIZE,
          search: searchQuery || undefined,
          role: roleFilter,
          status: statusFilter,
        })
        if (cancelled) return
        setUsers(result.users)
        setTotalItems(result.pagination.totalItems)
        setTotalPages(result.pagination.totalPages)
        setLoadState('ready')
      } catch {
        if (!cancelled) {
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [page, searchQuery, roleFilter, statusFilter])

  const updateUserInList = useCallback((detail: AdminUserDetail) => {
    const listItem = adminUserDetailToListItem(detail)
    setUsers((current) =>
      current.map((user) => (user.id === detail.id ? listItem : user)),
    )
    setPanelDetail(detail)
  }, [])

  const handleActionError = (error: unknown) => {
    if (error instanceof ApiError && error.message) {
      toast.error(adminUsersContent.toast.conflict(error.message))
      return
    }
    toast.error(adminUsersContent.toast.actionError)
  }

  const runAction = async (
    action: () => Promise<{ user: AdminUserDetail }>,
    successMessage: string,
  ) => {
    setSubmitting(true)
    try {
      const result = await action()
      updateUserInList(result.user)
      toast.success(successMessage)
      setActiveAction(null)
    } catch (error) {
      handleActionError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnflag = async (user: AdminUserListItem) => {
    setSubmitting(true)
    try {
      const result = await adminPortalService.unflagUser(user.id)
      updateUserInList(result.user)
      toast.success(adminUsersContent.toast.unflagged(user.organisationName))
    } catch (error) {
      handleActionError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewProfile = (id: string) => {
    setPanelDetail(null)
    setSelectedUserId(id)
    setPanelOpen(true)
  }

  const activeUser = activeAction?.user

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {adminUsersContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm">{adminUsersContent.pageSubtitle}</p>
      </header>

      <AdminUsersFilters
        search={searchInput}
        role={roleFilter}
        status={statusFilter}
        onSearchChange={setSearchInput}
        onRoleChange={(value) => {
          setRoleFilter(value)
          setPage(1)
        }}
        onStatusChange={(value) => {
          setStatusFilter(value)
          setPage(1)
        }}
      />

      {loadState === 'loading' ? (
        <p className="text-body text-sm">{adminUsersContent.loading}</p>
      ) : loadState === 'error' ? (
        <p className="text-clay-red text-sm">{adminUsersContent.loadError}</p>
      ) : users.length === 0 ? (
        <div className="border-border rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-body text-sm">{adminUsersContent.empty}</p>
        </div>
      ) : (
        <>
          <AdminUsersTable
            users={users}
            onViewProfile={handleViewProfile}
            onFlag={(user) => setActiveAction({ type: 'flag', user })}
            onUnflag={handleUnflag}
            onSuspend={(user) => setActiveAction({ type: 'suspend', user })}
            onReactivate={(user) =>
              setActiveAction({ type: 'reactivate', user })
            }
            onRevoke={(user) => setActiveAction({ type: 'revoke', user })}
            onRestore={(user) => setActiveAction({ type: 'restore', user })}
          />
          <VerificationQueuePager
            page={page}
            totalPages={totalPages}
            shownCount={users.length}
            totalItems={totalItems}
            onPageChange={setPage}
            labels={adminUsersContent.pager}
          />
        </>
      )}

      <AdminUserProfilePanel
        userId={selectedUserId}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        detailOverride={panelDetail}
      />

      {activeUser && activeAction?.type === 'flag' ? (
        <AdminUserFlagModal
          open
          onOpenChange={(open) => {
            if (!open) setActiveAction(null)
          }}
          organisationName={activeUser.organisationName}
          submitting={submitting}
          onSubmit={(payload) =>
            void runAction(
              () => adminPortalService.flagUser(activeUser.id, payload),
              adminUsersContent.toast.flagged(activeUser.organisationName),
            )
          }
        />
      ) : null}

      {activeUser && activeAction?.type === 'suspend' ? (
        <AdminUserSuspendModal
          open
          onOpenChange={(open) => {
            if (!open) setActiveAction(null)
          }}
          organisationName={activeUser.organisationName}
          submitting={submitting}
          onSubmit={(payload) =>
            void runAction(
              () => adminPortalService.suspendUser(activeUser.id, payload),
              adminUsersContent.toast.suspended(activeUser.organisationName),
            )
          }
        />
      ) : null}

      {activeUser && activeAction?.type === 'reactivate' ? (
        <AdminUserReactivateModal
          open
          onOpenChange={(open) => {
            if (!open) setActiveAction(null)
          }}
          organisationName={activeUser.organisationName}
          submitting={submitting}
          onSubmit={() =>
            void runAction(
              () => adminPortalService.reactivateUser(activeUser.id),
              adminUsersContent.toast.reactivated(activeUser.organisationName),
            )
          }
        />
      ) : null}

      {activeUser && activeAction?.type === 'revoke' ? (
        <AdminUserRevokeModal
          open
          onOpenChange={(open) => {
            if (!open) setActiveAction(null)
          }}
          organisationName={activeUser.organisationName}
          submitting={submitting}
          onSubmit={(payload) =>
            void runAction(
              () =>
                adminPortalService.revokeUserVerification(
                  activeUser.id,
                  payload,
                ),
              adminUsersContent.toast.revoked(activeUser.organisationName),
            )
          }
        />
      ) : null}

      {activeUser && activeAction?.type === 'restore' ? (
        <AdminUserRestoreModal
          open
          onOpenChange={(open) => {
            if (!open) setActiveAction(null)
          }}
          organisationName={activeUser.organisationName}
          submitting={submitting}
          onSubmit={() =>
            void runAction(
              () => adminPortalService.restoreUserVerification(activeUser.id),
              adminUsersContent.toast.restored(activeUser.organisationName),
            )
          }
        />
      ) : null}
    </div>
  )
}
