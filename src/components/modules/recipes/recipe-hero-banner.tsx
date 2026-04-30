import { ChefHat } from 'lucide-react'
import type { ReactNode } from 'react'

/** Hero for the recipe detail page: image (or placeholder) + title/tags below. */
interface Props {
  name: string
  imageUrl?: string | null
  tags?: ReactNode
}

export function RecipeHeroBanner({ name, imageUrl, tags }: Props) {
  return (
    <div className="shrink-0 rounded-2xl border border-border/60 bg-muted/30 shadow-sm">
      <div className="relative flex min-h-32 w-full items-center justify-center bg-muted/40 px-2 py-3 sm:min-h-40 sm:py-4 md:min-h-44">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="mx-auto block h-auto max-h-[min(52vh,26rem)] w-full object-contain object-center"
          />
        ) : (
          <div
            className="flex min-h-28 w-full items-center justify-center bg-linear-to-br from-primary/20 via-muted/55 to-muted py-8"
            aria-hidden
          >
            <ChefHat className="size-16 text-primary/35 sm:size-20" />
          </div>
        )}
      </div>
      <div className="border-t border-border/50 bg-background/95 px-4 py-4 sm:px-6">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {name}
        </h1>
        {tags ? <div className="mt-2">{tags}</div> : null}
      </div>
    </div>
  )
}
