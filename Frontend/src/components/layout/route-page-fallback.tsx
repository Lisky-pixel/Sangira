export function RoutePageFallback() {
  return (
    <div className="bg-cream flex min-h-[40vh] items-center justify-center px-4 font-sans">
      <p className="text-body text-sm" role="status" aria-live="polite">
        Loading…
      </p>
    </div>
  )
}
