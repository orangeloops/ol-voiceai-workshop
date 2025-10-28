export function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded animate-pulse w-20" />
          <div className="h-5 bg-muted rounded-full animate-pulse w-16" />
        </div>
      </div>
    </div>
  )
}
