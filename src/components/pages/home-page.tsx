import { Link } from '@tanstack/react-router'
import { SidebarLayout } from '../layouts/sidebar-layout'
import { Button } from '../ui/button'

export function HomePage() {
  return (
     <SidebarLayout>
        <Link to="/about">
          <p>About</p>
        </Link>
        <Button>Click me</Button>
    </SidebarLayout>
     
  )
}
