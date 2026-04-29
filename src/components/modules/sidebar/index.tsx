

import { Logo } from "#/components/elements/logo"
import { ThemeToggle } from "#/components/elements/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar"
import { Profile } from "../user/profile"



export function SidebarComponent() {
  return (
      <Sidebar >
      <SidebarHeader className="p-4 border-b flex flex-col gap-2">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-4">
      </SidebarContent>
      <SidebarFooter className="p-4 border-t flex flex-col gap-2">
        <ThemeToggle />
        <Profile />
      </SidebarFooter>
    </Sidebar>
  )
}
