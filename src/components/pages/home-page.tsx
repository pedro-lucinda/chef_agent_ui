import { createThread } from '#/services/api'
import { useTheadsStore } from '#/store/theads'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from '@tanstack/react-router'
import { ChefHat } from 'lucide-react'
import { useState } from 'react'
import type { PromptInputMessage } from '../ai-elements/prompt-input'
import { SidebarLayout } from '../layouts/sidebar-layout'
import { PromptInputComponent } from '../modules/thread/prompt-input'
import { TextGenerateEffect } from '../ui/text-generate-effect'

export function HomePage() {
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0()
  const setIncomingMessage = useTheadsStore((state) => state.setIncomingMessage)

  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'streaming' | 'ready'>('ready')

  async function handleSubmit(message: PromptInputMessage): Promise<void> {
    setStatus('streaming')
    try {
      const accessToken = await getAccessTokenSilently()
      const thread = await createThread(accessToken)
      setIncomingMessage({ message: message.text, threadId: thread.id, files: message.files })
      navigate({ to: '/threads/$id', params: { id: thread.id } })
    } catch (error) {
      console.error(error)
    } finally {
      setStatus('ready')
    }
  }

  return (
    <SidebarLayout>
      <div className="flex flex-col w-full max-w-4xl mx-auto h-full justify-center gap-5">
        <div className="flex flex-col mx-auto  text-center gap-1">
          <ChefHat className="w-10 h-10 mx-auto" />
          <TextGenerateEffect
            words="Welcome to the Chef App"
            className="text-5xl max-md:text-4xl max-sm:text-2xl"
            repeatIntervalMs={15_000}
          />
          <TextGenerateEffect
            words="You can start by asking for a recipe or a meal plan"
            className="text-lg text-muted-foreground font-light "
            repeatIntervalMs={12_000}
          />
        </div>

        <PromptInputComponent
          handleSubmit={handleSubmit}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          status={status}
        />
      </div>
    </SidebarLayout>
  )
}
