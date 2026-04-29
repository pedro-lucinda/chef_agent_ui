import { Link } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="max-w-md space-y-2">
        <h1 className="text-lg font-semibold">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          This URL does not match any route. Check the address or go back home.
        </p>
      </div>
      <Button type="button" variant="default" asChild>
        <Link to="/">Home</Link>
      </Button>
    </div>
  )
}
