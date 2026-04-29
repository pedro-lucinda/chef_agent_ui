import { SidebarComponent } from "../modules/sidebar";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

interface Props {
  children: React.ReactNode
  title?: string
  isTitleLoading?: boolean
}

export function SidebarLayout({ children, title, isTitleLoading }: Props) {
  return (
    <SidebarProvider>
      <SidebarComponent />
      <SidebarInset>
         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
         {title && isTitleLoading ? <Skeleton className="h-10 w-full" /> : <p>{title}</p>}
        </header>
        <div className="flex flex-col gap-2 p-4 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}