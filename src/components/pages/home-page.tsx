import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'

export function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/about">
        <p>About</p>
      </Link>
      <Button>Click me</Button>
    </div>
  )
}
