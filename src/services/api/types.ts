/** Optional client-side or API-provided attachment metadata on a message */
export interface MessageAttachment {
  url: string
  mediaType?: string
  filename?: string
}

/** Message row returned on threads / history */
export interface MessageOut {
  id: string
  content: string
  role: 'user' | 'assistant'
  thread_id: string
  created_at: string
  updated_at: string
  /** Present on assistant messages when a recipe was attached */
  recipes?: RecipeFromStream[] | null
  /** User images / files (optimistic UI or when API returns them) */
  attachments?: MessageAttachment[] | null
}

export interface ThreadOut {
  id: string
  user_id: number
  created_at: string
  updated_at: string
  messages: MessageOut[]
}

export interface UserOut {
  id: number
  auth0_id: string
  email: string
  name: string | null
  surname: string | null
  img: string | null
}

export interface UserUpdate {
  email?: string
  name?: string
  surname?: string
  img?: string
}

export interface IngredientItem {
  name: string
  quantity: string
}

export interface InstructionStep {
  step_number: number
  description: string
  time_minutes: number
  chef_tip?: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  prep_time: number
  cook_time: number
  total_time: number
  servings: number
  difficulty: string
  ingredients: IngredientItem[]
  instructions: InstructionStep[]
  tags: string[]
  image_url?: string
  created_at?: string
  updated_at?: string
}

export interface RecipeCreate {
  name: string
  description: string
  prep_time: number
  cook_time: number
  total_time: number
  servings: number
  difficulty: string
  ingredients: IngredientItem[]
  instructions: InstructionStep[]
  tags?: string[]
  image_url?: string
}

export interface RecipeUpdate {
  name?: string
  description?: string
  prep_time?: number
  cook_time?: number
  total_time?: number
  servings?: number
  difficulty?: string
  ingredients?: IngredientItem[]
  instructions?: InstructionStep[]
  tags?: string[]
  image_url?: string
}

/** Recipe payload inside SSE `recipe` events (normalized) */
export interface RecipeFromStream {
  name: string
  description?: string
  prep_time?: number
  cook_time?: number
  total_time?: number
  servings?: number
  difficulty?: string
  ingredients: Array<{ name: string; quantity: string }>
  instructions: Array<{
    step_number: number
    description: string
    time_minutes: number
    chef_tip?: string
  }>
  tags?: string[]
  image_url?: string
}

export type ChatSseStatusEvent = { type: 'status'; status: string }

export type ChatSseDataEvent = {
  type: 'data'
  data: string
  thread_id?: string
}

export type ChatSseRecipeEvent = {
  type: 'recipe'
  recipes: RecipeFromStream[]
}

export type ChatSseEvent =
  | ChatSseStatusEvent
  | ChatSseDataEvent
  | ChatSseRecipeEvent
  | Record<string, unknown>

export interface StreamChatParams {
  thread_id: string
  message: string
  /** @deprecated Prefer {@link StreamChatParams.images} */
  image?: File
  /** Each file is appended as multipart field `image` (repeated keys). */
  images?: File[]
  user_language?: string
}
