import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AdminSlaStepper } from '../../components/admin/admin-sla-stepper'
import { Toggle } from '../../components/ui/toggle'
import { Button } from '../../components/ui/button'
import {
  ADMIN_NOTIFICATION_EVENT_KEYS,
  type AdminNotificationEventKey,
  type AdminNotificationEventPreferences,
} from '../../constants/admin-notification-preferences'
import { useAdminLogout } from '../../hooks/use-admin-logout'
import { useAdminPlatformSettings } from '../../hooks/use-admin-platform-settings'
import { cn } from '../../lib/utils'
import { toast } from '../../lib/toast'
import { adminSettingsContent } from '../../placeholder/admin-settings-content'
import { adminNotificationPreferencesService } from '../../services/admin-notification-preferences-service'
import { adminSettingsService } from '../../services/admin-profile-service'

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

function AccountRow({ children }: { children: ReactNode }) {
  return (
    <div className="border-border flex flex-col gap-4 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  )
}

export function AdminSettingsPage() {
  const adminLogout = useAdminLogout()
  const {
    verificationSlaTargetHours,
    setVerificationSlaTargetHours,
    loadState: platformLoadState,
  } = useAdminPlatformSettings()

  const [prefs, setPrefs] = useState<AdminNotificationEventPreferences | null>(
    null,
  )
  const [pageLoadState, setPageLoadState] = useState<
    'loading' | 'ready' | 'error'
  >('loading')
  const [savingKey, setSavingKey] = useState<AdminNotificationEventKey | null>(
    null,
  )
  const [savingSla, setSavingSla] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setPageLoadState('loading')
      try {
        const settings = await adminSettingsService.getSettings()
        if (!cancelled) {
          setPrefs(settings.adminNotificationPrefs)
          setPageLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setPrefs(null)
          setPageLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  const handlePreferenceChange = useCallback(
    async (key: AdminNotificationEventKey, nextValue: boolean) => {
      if (!prefs) return

      const previousValue = prefs[key]
      if (previousValue === nextValue) return

      setPrefs({ ...prefs, [key]: nextValue })
      setSavingKey(key)

      try {
        const updated =
          await adminNotificationPreferencesService.updateEventPreference(
            key,
            nextValue,
          )
        setPrefs(updated)
        toast.success(adminSettingsContent.toast.preferenceSaved)
      } catch {
        setPrefs({ ...prefs, [key]: previousValue })
        toast.error(adminSettingsContent.toast.preferenceError)
      } finally {
        setSavingKey(null)
      }
    },
    [prefs],
  )

  const handleSlaChange = async (nextHours: number) => {
    if (nextHours === verificationSlaTargetHours) return

    const previous = verificationSlaTargetHours
    setVerificationSlaTargetHours(nextHours)
    setSavingSla(true)

    try {
      const saved =
        await adminSettingsService.updateVerificationSlaTargetHours(nextHours)
      setVerificationSlaTargetHours(saved)
      toast.success(adminSettingsContent.toast.slaSaved)
    } catch {
      setVerificationSlaTargetHours(previous)
      toast.error(adminSettingsContent.toast.slaError)
    } finally {
      setSavingSla(false)
    }
  }

  if (pageLoadState === 'loading' || platformLoadState === 'loading' || !prefs) {
    return <p className="text-body text-sm">{adminSettingsContent.loading}</p>
  }

  if (pageLoadState === 'error') {
    return (
      <p className="text-clay-red text-sm">{adminSettingsContent.loadError}</p>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {adminSettingsContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm sm:text-base">
          {adminSettingsContent.pageSubtitle}
        </p>
      </header>

      <SettingsCard
        title={adminSettingsContent.notifications.title}
        subtitle={adminSettingsContent.notifications.subtitle}
      >
        <ul className="flex flex-col gap-4">
          {ADMIN_NOTIFICATION_EVENT_KEYS.map((key, index) => {
            const row = adminSettingsContent.notifications.rows[key]
            const description =
              typeof row.description === 'function'
                ? row.description(verificationSlaTargetHours)
                : row.description

            return (
              <li
                key={key}
                className={cn(index > 0 && 'border-border border-t pt-4')}
              >
                <Toggle
                  id={`admin-notification-pref-${key}`}
                  label={row.title}
                  description={description}
                  checked={prefs[key]}
                  disabled={savingKey === key}
                  onChange={(checked) =>
                    void handlePreferenceChange(key, checked)
                  }
                />
              </li>
            )
          })}
        </ul>
      </SettingsCard>

      <SettingsCard
        title={adminSettingsContent.platform.title}
        subtitle={adminSettingsContent.platform.subtitle}
      >
        <AdminSlaStepper
          value={verificationSlaTargetHours}
          onChange={(value) => void handleSlaChange(value)}
          disabled={savingSla}
        />
      </SettingsCard>

      <SettingsCard title={adminSettingsContent.account.title}>
        <AccountRow>
          <p className="text-charcoal text-sm font-semibold">
            {adminSettingsContent.account.language.label}
          </p>
          <div className="sm:text-right">
            <p className="text-charcoal text-sm font-semibold">
              {adminSettingsContent.account.language.value}
            </p>
            <p className="text-body mt-0.5 text-sm">
              {adminSettingsContent.account.language.comingSoon}
            </p>
          </div>
        </AccountRow>

        <AccountRow>
          <div>
            <p className="text-charcoal text-sm font-semibold">
              {adminSettingsContent.account.signOut.label}
            </p>
            <p className="text-body mt-0.5 text-sm">
              {adminSettingsContent.account.signOut.description}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="text-clay-red hover:text-clay-red w-full justify-start px-0 sm:w-auto sm:justify-center"
            onClick={() => void adminLogout()}
          >
            {adminSettingsContent.account.signOut.button}
          </Button>
        </AccountRow>
      </SettingsCard>
    </div>
  )
}
