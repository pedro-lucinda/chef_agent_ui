import { SIDEBAR_ITEMS } from '#/constants/sidebar'
import { Logo } from '#/components/elements/logo'
import { ThemeToggle } from '#/components/elements/theme-toggle'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Profile } from '../user/profile'
import { ThreadsList } from './threads-list'

export function SidebarComponent() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b flex flex-col gap-2">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-4 flex flex-col">
        <Button
          className="w-full mb-4"
          onClick={() => {
            navigate({ to: '/' })
          }}
        >
          New Chat
        </Button>
        {SIDEBAR_ITEMS.map((item) => {
          return (
            <SidebarMenuButton
              key={item.id}
              className={cn(item.path ? 'cursor-pointer' : 'hover:bg-transparent')}
              isActive={item.path === location.pathname}
              onClick={() => {
                if (item.path) {
                  navigate({ to: item.path })
                }
              }}
            >
              <span className="text-sm">{item.name}</span>
            </SidebarMenuButton>
          )
        })}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-bold p-0">Theads</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-1 max-h-[400px] h-full overflow-y-auto">
            <ThreadsList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t flex flex-col gap-2">
        <ThemeToggle />
        <Profile />
      </SidebarFooter>
    </Sidebar>
  )
}
