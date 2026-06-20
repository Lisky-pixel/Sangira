function SkeletonBlock({ className }: { className: string }) {
  return <div className={`bg-sand animate-pulse rounded-2xl ${className}`} />
}

export function AdminReportsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SkeletonBlock className="min-h-[22rem] sm:min-h-[24rem]" />
        <SkeletonBlock className="min-h-[22rem] sm:min-h-[24rem]" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SkeletonBlock className="min-h-64" />
        <SkeletonBlock className="min-h-64" />
      </div>
    </div>
  )
}
