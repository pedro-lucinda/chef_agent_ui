import { cn } from '#/lib/utils'

interface Props {
  title: string
  isActive: boolean
  onClick: () => void
}

export function ThreadItem({ title, isActive, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer  min-h-7 h-7 px-3 flex items-center ml-2 rounded-sm hover:bg-primary/10"
    >
      <p className={cn('text-sm', isActive ? 'font-bold border-b border-primary' : '')}>
        {title ? (title.length > 20 ? `${title.substring(0, 20)}...` : title) : 'Untitled'}
      </p>
    </div>
  )
}
