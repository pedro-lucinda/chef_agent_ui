import { Link } from '@tanstack/react-router'
import { SidebarLayout } from '../layouts/sidebar-layout'

export function AboutPage() {
  return (
    <SidebarLayout>
      <h1>About Page</h1>
      <Link to="/">
        <p>Home</p>
      </Link>
    </SidebarLayout>
  )
}
