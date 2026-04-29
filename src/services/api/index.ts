import type {
  ChatSseEvent,
  Recipe,
  RecipeCreate,
  RecipeUpdate,
  StreamChatParams,
  ThreadOut,
  UserOut,
  UserUpdate,
} from './types'

export type * from './types'

function getBaseUrl(): string {
  const raw = import.meta.env.VITE_BACKEND_URL
  if (!raw?.trim()) {
    throw new Error('VITE_BACKEND_URL is not set')
  }
  return raw.replace(/\/$/, '')
}

function authHeaders(accessToken: string, extra?: HeadersInit): Headers {
  const h = new Headers(extra)
  h.set('Authorization', `Bearer ${accessToken}`)
  return h
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function formatErrorMessage(body: unknown, fallback: string): string {
  if (body !== null && typeof body === 'object' && 'detail' in body) {
    const detail = (body as Record<string, unknown>).detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return JSON.stringify(detail)
  }
  return fallback
}

export class ApiRequestError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.body = body
  }
}

async function requestJson<T>(
  accessToken: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const headers = authHeaders(accessToken, init.headers)
  if (init.body !== undefined && !(init.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }
  const res = await fetch(url, { ...init, headers })
  const body = res.ok ? null : await readBody(res)
  if (!res.ok) {
    throw new ApiRequestError(
      formatErrorMessage(body, res.statusText),
      res.status,
      body,
    )
  }
  if (res.status === 204) return undefined as T
  const parsed = await readBody(res)
  return parsed as T
}

/** Build multipart body for `POST /chat/stream` */
export function buildStreamChatFormData(params: StreamChatParams): FormData {
  const fd = new FormData()
  fd.append('thread_id', params.thread_id)
  fd.append('message', params.message)
  if (params.image) fd.append('image', params.image)
  if (params.user_language) fd.append('user_language', params.user_language)
  return fd
}

/**
 * Opens SSE stream for chat. Caller reads `response.body` or use {@link readChatSseStream}.
 * Does not throw on HTTP error until body is consumed — check `response.ok` first if needed.
 */
export async function postChatStream(
  accessToken: string,
  formData: FormData,
  init?: RequestInit,
): Promise<Response> {
  const url = `${getBaseUrl()}/chat/stream`
  const headers = authHeaders(accessToken, init?.headers)
  return fetch(url, {
    ...init,
    method: 'POST',
    headers,
    body: formData,
  })
}

/**
 * Same as {@link postChatStream} but builds `FormData` from fields.
 * If `!response.ok`, reads JSON error and throws {@link ApiRequestError}.
 */
export async function streamChat(
  accessToken: string,
  params: StreamChatParams,
  init?: RequestInit,
): Promise<Response> {
  const res = await postChatStream(
    accessToken,
    buildStreamChatFormData(params),
    init,
  )
  if (!res.ok) {
    const body = await readBody(res)
    throw new ApiRequestError(
      formatErrorMessage(body, res.statusText),
      res.status,
      body,
    )
  }
  return res
}

/** Parse `text/event-stream` chunks (`data: {...}\\n\\n`) from a chat stream response */
export async function* readChatSseStream(
  response: Response,
): AsyncGenerator<ChatSseEvent, void, undefined> {
  if (!response.body) {
    throw new Error('Response has no body (cannot read SSE)')
  }
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() ?? ''
    for (const chunk of blocks) {
      const line = chunk.trim()
      if (line.startsWith('data: ')) {
        try {
          yield JSON.parse(line.slice(6)) as ChatSseEvent
        } catch {
          /* skip malformed */
        }
      }
    }
  }
  const tail = buffer.trim()
  if (tail.startsWith('data: ')) {
    try {
      yield JSON.parse(tail.slice(6)) as ChatSseEvent
    } catch {
      /* skip */
    }
  }
}

/** `POST /thread/` */
export function createThread(accessToken: string): Promise<ThreadOut> {
  return requestJson<ThreadOut>(accessToken, '/thread/', { method: 'POST' })
}

/** `GET /thread/` */
export function listThreads(accessToken: string): Promise<ThreadOut[]> {
  return requestJson<ThreadOut[]>(accessToken, '/thread/', { method: 'GET' })
}

/** `GET /thread/{thread_id}` */
export function getThread(
  accessToken: string,
  threadId: string,
): Promise<ThreadOut> {
  return requestJson<ThreadOut>(accessToken, `/thread/${encodeURIComponent(threadId)}`, {
    method: 'GET',
  })
}

/** `DELETE /thread/{thread_id}` */
export function deleteThread(
  accessToken: string,
  threadId: string,
): Promise<void> {
  return requestJson<void>(accessToken, `/thread/${encodeURIComponent(threadId)}`, {
    method: 'DELETE',
  })
}

/** `GET /user/me` */
export function getCurrentUser(accessToken: string): Promise<UserOut> {
  return requestJson<UserOut>(accessToken, '/user/me', { method: 'GET' })
}

/** `PATCH /user/me` */
export function updateCurrentUser(
  accessToken: string,
  body: UserUpdate,
): Promise<UserOut> {
  return requestJson<UserOut>(accessToken, '/user/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

/** `POST /recipes/` */
export function createRecipe(
  accessToken: string,
  body: RecipeCreate,
): Promise<Recipe> {
  return requestJson<Recipe>(accessToken, '/recipes/', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** `GET /recipes/` */
export function listRecipes(accessToken: string): Promise<Recipe[]> {
  return requestJson<Recipe[]>(accessToken, '/recipes/', { method: 'GET' })
}

/** `GET /recipes/{recipe_id}` */
export function getRecipe(
  accessToken: string,
  recipeId: string,
): Promise<Recipe> {
  return requestJson<Recipe>(accessToken, `/recipes/${encodeURIComponent(recipeId)}`, {
    method: 'GET',
  })
}

/** `PATCH /recipes/{recipe_id}` */
export function updateRecipe(
  accessToken: string,
  recipeId: string,
  body: RecipeUpdate,
): Promise<Recipe> {
  return requestJson<Recipe>(accessToken, `/recipes/${encodeURIComponent(recipeId)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

/** `DELETE /recipes/{recipe_id}` */
export function deleteRecipe(
  accessToken: string,
  recipeId: string,
): Promise<void> {
  return requestJson<void>(accessToken, `/recipes/${encodeURIComponent(recipeId)}`, {
    method: 'DELETE',
  })
}
