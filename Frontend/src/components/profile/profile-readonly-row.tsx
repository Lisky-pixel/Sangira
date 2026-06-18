type ProfileReadOnlyRowProps = {
  label: string
  value: string
  note?: string
}

export function ProfileReadOnlyRow({
  label,
  value,
  note,
}: ProfileReadOnlyRowProps) {
  return (
    <div className="border-border flex flex-col gap-1 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-body text-xs font-medium tracking-wide uppercase">
          {label}
        </p>
        <p className="text-charcoal mt-1 text-sm font-semibold">{value}</p>
        {note ? <p className="text-body mt-1 text-xs">{note}</p> : null}
      </div>
    </div>
  )
}
