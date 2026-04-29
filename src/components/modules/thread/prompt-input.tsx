import { PromptInput, PromptInputSubmit, PromptInputTextarea, type PromptInputMessage } from "#/components/ai-elements/prompt-input"
import type { ChangeEventHandler } from "react"

interface Props {
  handleSubmit: (message: PromptInputMessage) => Promise<void>
  onChange: ChangeEventHandler<HTMLTextAreaElement>
  value: string
  status: "streaming" | "ready"
  onStop?: () => void
}

export function PromptInputComponent({
  handleSubmit,
  onChange,
  value,
  status,
  onStop,
}: Props) {
  return (
     <PromptInput
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-7xl mx-auto relative"
        >
          <PromptInputTextarea
            value={value}
            placeholder="Say something..."
            onChange={onChange}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={status !== "streaming" && !value.trim()}
            onStop={onStop}
            className="absolute bottom-1 right-1"
          />
        </PromptInput>
  )
}