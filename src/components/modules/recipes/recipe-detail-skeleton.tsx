import { Skeleton } from '../../ui/skeleton'

export function RecipeDetailSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden">
      <div className="flex shrink-0 flex-col gap-0 overflow-hidden rounded-xl border border-border/40">
        <Skeleton className="h-48 w-full sm:h-56 md:h-64" />
        <Skeleton className="h-20 w-full rounded-none" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="grid flex-1 gap-6 lg:grid-cols-2">
        <Skeleton className="min-h-48 rounded-xl" />
        <Skeleton className="min-h-64 rounded-xl" />
      </div>
    </div>
  )
}
