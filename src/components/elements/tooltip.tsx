import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface Props {
  content: string
  children: React.ReactNode
}

export function TooltipComponent({ content, children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}