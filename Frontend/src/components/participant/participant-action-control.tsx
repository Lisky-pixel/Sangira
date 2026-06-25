import { type ComponentProps, type ReactNode } from 'react'
import { useParticipantEditBlocked } from '../../hooks/use-participant-edit-blocked'
import { cn } from '../../lib/utils'
import { Button, ButtonLink } from '../ui/button'

type BlockedShellProps = {
  children: ReactNode
  message: string | null
  className?: string
  showNote?: boolean
}

function BlockedShell({
  children,
  message,
  className,
  showNote = true,
}: BlockedShellProps) {
  return (
    <span
      className={cn('inline-flex w-full flex-col', className)}
      title={message ?? undefined}
    >
      {children}
      {showNote && message ? (
        <p className="text-body mt-2 text-xs leading-relaxed" role="note">
          {message}
        </p>
      ) : null}
    </span>
  )
}

export function ParticipantActionBlockNote({
  className,
}: {
  className?: string
}) {
  const { blocked, message } = useParticipantEditBlocked()

  if (!blocked || !message) {
    return null
  }

  return (
    <p className={cn('text-body text-xs leading-relaxed', className)} role="note">
      {message}
    </p>
  )
}

type ParticipantActionButtonProps = ComponentProps<typeof Button> & {
  showBlockNote?: boolean
}

export function ParticipantActionButton({
  disabled,
  className,
  showBlockNote = true,
  ...props
}: ParticipantActionButtonProps) {
  const { blocked, message } = useParticipantEditBlocked()

  if (blocked) {
    return (
      <BlockedShell message={message} className={className} showNote={showBlockNote}>
        <Button {...props} className={cn('w-full', className)} disabled />
      </BlockedShell>
    )
  }

  return (
    <Button {...props} className={className} disabled={disabled} />
  )
}

type ParticipantActionLinkProps = ComponentProps<typeof ButtonLink> & {
  showBlockNote?: boolean
}

export function ParticipantActionLink({
  className,
  showBlockNote = true,
  children,
  ...props
}: ParticipantActionLinkProps) {
  const { blocked, message } = useParticipantEditBlocked()

  if (blocked) {
    return (
      <BlockedShell message={message} className={className} showNote={showBlockNote}>
        <Button
          type="button"
          variant={props.variant}
          size={props.size}
          className={cn('w-full', className)}
          disabled
        >
          {children}
        </Button>
      </BlockedShell>
    )
  }

  return (
    <ButtonLink {...props} className={className}>
      {children}
    </ButtonLink>
  )
}
