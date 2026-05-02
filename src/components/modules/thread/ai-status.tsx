
interface Props {
  message?: string
}

export function AiStatus({ message }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex gap-1 items-center py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
      </span>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}