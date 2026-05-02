import { SidebarComponent } from '../modules/sidebar'
import { Separator } from '../ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { Skeleton } from '../ui/skeleton'

interface Props {
  children: React.ReactNode
  title?: string
  isTitleLoading?: boolean
}

export function SidebarLayout({ children, title, isTitleLoading }: Props) {
  return (
    <SidebarProvider>
      <SidebarComponent />
      <SidebarInset className="h-screen overflow-hidden">
        <header className="flex h-16 min-w-0 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <Separator
            orientation="vertical"
            className="mr-2 shrink-0 data-[orientation=vertical]:h-4"
          />
          {title && isTitleLoading ? (
            <Skeleton className="h-8 min-w-0 flex-1" />
          ) : title ? (
            <p
              className="min-w-0 flex-1 truncate text-sm font-medium text-foreground"
              title={title}
            >
              {title}
            </p>
          ) : null}
        </header>
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-2 overflow-hidden p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
