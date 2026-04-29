

import { SIDEBAR_ITEMS } from "#/components/constants/sidebar"
import { Logo } from "#/components/elements/logo"
import { ThemeToggle } from "#/components/elements/theme-toggle"
import { cn } from "#/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { Profile } from "../user/profile"



export function SidebarComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  return (
      <Sidebar >
      <SidebarHeader className="p-4 border-b flex flex-col gap-2">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-4">
        {SIDEBAR_ITEMS.map((item) => {
          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
              className={cn(item?.path ? 'cursor-pointer' :'hover:bg-transparent')}
                isActive={item.path === location.pathname}
                onClick={() => {
                  if (item.path) {
                    navigate({ to: item.path })
                  }
                }}
              >
                <span className="text-sm font-bold">{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t flex flex-col gap-2">
        <ThemeToggle />
        <Profile />
      </SidebarFooter>
    </Sidebar>
  )
}
