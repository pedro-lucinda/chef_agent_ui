import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/">
      <div className="flex items-center gap-2">
        <p className="text-lg font-bold ">Chef App</p>
      </div>
    </Link>
  )
}