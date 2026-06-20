import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatRelativeTime } from '../../lib/relative-time'
import { maskPhoneForDisplay } from '../../lib/profile-format'
import { adminUsersContent } from '../../placeholder/admin-users-content'
import { adminPortalService } from '../../services/admin-portal-service'
import type { AdminUserDetail } from '../../types/admin-users'
import { AdminUserDocumentViewer } from './admin-user-document-viewer'
import { AdminUserStatusChip } from './admin-user-status-chip'
import { VerificationRoleChip } from './verification-role-chip'

type AdminUserProfilePanelProps = {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  detailOverride?: AdminUserDetail | null
}

function resolveVerificationStatusLabel(status: string) {
  const normalized = status.replace(/_/g, ' ')
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export function AdminUserProfilePanel({
  userId,
  open,
  onOpenChange,
  detailOverride,
}: AdminUserProfilePanelProps) {
  const [fetchedDetail, setFetchedDetail] = useState<AdminUserDetail | null>(null)
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  )
  const { profilePanel } = adminUsersContent

  useEffect(() => {
    if (!open || !userId || detailOverride) {
      return
    }

    let cancelled = false

    const load = async () => {
      setLoadState('loading')
      try {
        const user = await adminPortalService.getUserDetail(userId)
        if (cancelled) return
        setFetchedDetail(user)
        setLoadState('ready')
      } catch {
        if (!cancelled) {
          setFetchedDetail(null)
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [open, userId, detailOverride])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFetchedDetail(null)
      setLoadState('idle')
    }
    onOpenChange(nextOpen)
  }

  const activeDetail = detailOverride ?? fetchedDetail
  const resolvedLoadState = detailOverride ? 'ready' : loadState

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-charcoal/30" />
        <Dialog.Content className="border-border fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l bg-white shadow-xl focus:outline-none sm:max-w-2xl">
          <div className="flex items-start justify-between gap-4 border-b px-5 py-5">
            <div className="min-w-0">
              {activeDetail ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Dialog.Title className="text-charcoal truncate text-lg font-semibold">
                    {activeDetail.organisationName}
                  </Dialog.Title>
                  <VerificationRoleChip role={activeDetail.role} />
                  <AdminUserStatusChip status={activeDetail.listStatus} />
                </div>
              ) : (
                <Dialog.Title className="text-charcoal text-lg font-semibold">
                  {profilePanel.loadError}
                </Dialog.Title>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={profilePanel.closeAria}
                className="text-body hover:text-charcoal shrink-0 rounded-md p-1"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {resolvedLoadState === 'loading' ? (
              <p className="text-body text-sm">{adminUsersContent.loading}</p>
            ) : resolvedLoadState === 'error' ? (
              <p className="text-clay-red text-sm">{profilePanel.loadError}</p>
            ) : activeDetail ? (
              <div className="flex flex-col gap-6">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                      {profilePanel.fields.contactPerson}
                    </dt>
                    <dd className="text-charcoal mt-1 text-sm">
                      {activeDetail.contactName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                      {profilePanel.fields.phone}
                    </dt>
                    <dd className="text-charcoal mt-1 text-sm">
                      {maskPhoneForDisplay(activeDetail.phone) ||
                        activeDetail.phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                      {profilePanel.fields.email}
                    </dt>
                    <dd className="text-charcoal mt-1 text-sm">
                      <a
                        href={`mailto:${activeDetail.email}`}
                        className="text-primary hover:underline"
                      >
                        {activeDetail.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                      {profilePanel.fields.sector}
                    </dt>
                    <dd className="text-charcoal mt-1 text-sm">
                      {activeDetail.sectorLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                      {profilePanel.fields.location}
                    </dt>
                    <dd className="text-charcoal mt-1 text-sm">
                      {activeDetail.locationLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                      {profilePanel.fields.transfers}
                    </dt>
                    <dd className="text-charcoal mt-1 text-sm">
                      {profilePanel.transfersValue(activeDetail.transfersCount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                      {profilePanel.fields.accountStatus}
                    </dt>
                    <dd className="mt-1">
                      <AdminUserStatusChip status={activeDetail.listStatus} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                      {profilePanel.fields.verificationStatus}
                    </dt>
                    <dd className="text-charcoal mt-1 text-sm">
                      {resolveVerificationStatusLabel(
                        activeDetail.verificationStatus,
                      )}
                    </dd>
                  </div>
                  {activeDetail.registrationNumber ? (
                    <div>
                      <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                        {profilePanel.fields.registrationNumber}
                      </dt>
                      <dd className="text-charcoal mt-1 text-sm">
                        {activeDetail.registrationNumber}
                      </dd>
                    </div>
                  ) : null}
                  {typeof activeDetail.dailyCapacity === 'number' ? (
                    <div>
                      <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                        {profilePanel.fields.dailyCapacity}
                      </dt>
                      <dd className="text-charcoal mt-1 text-sm">
                        {profilePanel.dailyCapacityValue(
                          activeDetail.dailyCapacity,
                        )}
                      </dd>
                    </div>
                  ) : null}
                  {activeDetail.transportLabel ? (
                    <div>
                      <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                        {profilePanel.fields.transport}
                      </dt>
                      <dd className="text-charcoal mt-1 text-sm">
                        {activeDetail.transportLabel}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <AdminUserDocumentViewer
                  userId={activeDetail.id}
                  document={activeDetail.verification?.document}
                />

                <div className="flex flex-col gap-3">
                  <h3 className="text-body text-xs font-semibold tracking-wide uppercase">
                    {profilePanel.auditSectionTitle}
                  </h3>
                  {activeDetail.auditTrail.length === 0 ? (
                    <p className="text-body text-sm">{profilePanel.auditEmpty}</p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {activeDetail.auditTrail.map((entry) => {
                        const actionLabel =
                          adminUsersContent.auditActions[entry.action] ??
                          entry.action
                        const actor =
                          entry.actorAdminName?.trim() || 'Admin'

                        return (
                          <li
                            key={entry.id}
                            className="border-border rounded-lg border bg-sand/30 px-4 py-3"
                          >
                            <p className="text-charcoal text-sm">
                              {profilePanel.auditEntry(
                                actionLabel,
                                actor,
                                formatRelativeTime(entry.timestamp),
                                entry.reason,
                              )}
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
