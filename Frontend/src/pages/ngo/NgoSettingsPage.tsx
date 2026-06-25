import { useCallback, useState, type ReactNode } from 'react'
import { useAuth } from '../../auth'
import { useParticipantEditBlocked } from '../../hooks/use-participant-edit-blocked'
import { Toggle } from '../../components/ui/toggle'
import { Button } from '../../components/ui/button'
import {
  NGO_NOTIFICATION_EVENT_KEYS,
  type NgoNotificationEventKey,
} from '../../constants/ngo-notification-preferences'
import type { NotificationPreferences } from '../../constants/notification-preferences'
import { normalizeNotificationPrefs } from '../../lib/notification-preferences'
import { toast } from '../../lib/toast'
import { cn } from '../../lib/utils'
import { ngoSettingsContent } from '../../placeholder/ngo-settings-content'
import { ParticipantActionBlockNote } from '../../components/participant/participant-action-control'
import { participantEnforcementContent } from '../../placeholder/participant-enforcement-content'
import { ApiError } from '../../services/api-error'
import { notificationPreferencesService } from '../../services/notification-preferences-service'

function SettingsCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
      <header className="mb-5">
        <h2 className="text-charcoal text-lg font-semibold">{title}</h2>
        {subtitle ? (
          <p className="text-body mt-1 text-sm">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </section>
  )
}

function AccountRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-border flex flex-col gap-4 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function NgoSettingsPage() {
  const { state, logout, refreshMe } = useAuth()
  const { blocked: editsBlocked } = useParticipantEditBlocked()
  const [draftPrefs, setDraftPrefs] = useState<NotificationPreferences | null>(
    null,
  )
  const [savingKey, setSavingKey] = useState<NgoNotificationEventKey | null>(
    null,
  )

  const authPrefs =
    state.status === 'authed'
      ? normalizeNotificationPrefs(state.user.notificationPrefs)
      : null
  const prefs = draftPrefs ?? authPrefs

  const handlePreferenceChange = useCallback(
    async (key: NgoNotificationEventKey, nextValue: boolean) => {
      if (!prefs?.ngoEvents) return

      const previousValue = prefs.ngoEvents[key]
      if (previousValue === nextValue) return

      setDraftPrefs({
        ...prefs,
        ngoEvents: { ...prefs.ngoEvents, [key]: nextValue },
      })
      setSavingKey(key)

      try {
        await notificationPreferencesService.updateNgoEventPreference(
          key,
          nextValue,
        )
        setDraftPrefs(null)
        await refreshMe()
        toast.success(ngoSettingsContent.toast.preferenceSaved)
      } catch (error) {
        setDraftPrefs({
          ...prefs,
          ngoEvents: { ...prefs.ngoEvents, [key]: previousValue },
        })
        if (
          error instanceof ApiError &&
          (error.code === 'ACCOUNT_SUSPENDED' ||
            error.code === 'VERIFICATION_REVOKED')
        ) {
          toast.error(participantEnforcementContent.editsBlockedNote)
        } else {
          toast.error(ngoSettingsContent.toast.preferenceError)
        }
      } finally {
        setSavingKey(null)
      }
    },
    [prefs, refreshMe],
  )

  if (state.status !== 'authed' || !prefs?.ngoEvents) {
    return null
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {ngoSettingsContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm sm:text-base">
          {ngoSettingsContent.pageSubtitle}
        </p>
      </header>

      <SettingsCard
        title={ngoSettingsContent.notifications.title}
        subtitle={ngoSettingsContent.notifications.subtitle}
      >
        <ul className="flex flex-col gap-4">
          {NGO_NOTIFICATION_EVENT_KEYS.map((key, index) => {
            const row = ngoSettingsContent.notifications.rows[key]
            return (
              <li
                key={key}
                className={cn(index > 0 && 'border-border border-t pt-4')}
              >
                <Toggle
                  id={`ngo-notification-pref-${key}`}
                  label={row.title}
                  description={row.description}
                  checked={prefs.ngoEvents![key]}
                  disabled={editsBlocked || savingKey === key}
                  onChange={(checked) => void handlePreferenceChange(key, checked)}
                />
              </li>
            )
          })}
        </ul>
        {editsBlocked ? <ParticipantActionBlockNote className="mt-4" /> : null}
      </SettingsCard>

      <SettingsCard title={ngoSettingsContent.account.title}>
        <AccountRow>
          <p className="text-charcoal text-sm font-semibold">
            {ngoSettingsContent.account.language.label}
          </p>
          <div className="sm:text-right">
            <p className="text-charcoal text-sm font-semibold">
              {ngoSettingsContent.account.language.value}
            </p>
            <p className="text-body mt-0.5 text-sm">
              {ngoSettingsContent.account.language.comingSoon}
            </p>
          </div>
        </AccountRow>

        <AccountRow>
          <p className="text-charcoal text-sm font-semibold">
            {ngoSettingsContent.account.signOut.label}
          </p>
          <Button
            type="button"
            variant="outline"
            className="border-clay-red text-clay-red hover:bg-clay-red/5 w-full sm:w-auto"
            onClick={() => void logout()}
          >
            {ngoSettingsContent.account.signOut.button}
          </Button>
        </AccountRow>
      </SettingsCard>
    </div>
  )
}
