import { Link } from '@tanstack/react-router'

export function AboutPage() {
  return (
    <div>
      <h1>About Page</h1>
      <Link to="/">
        <p>Home</p>
      </Link>
    </div>
  )
}
