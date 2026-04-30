import type { FileUIPart } from "ai"

export interface IThead {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface IncomingMessage {
  message: string
  threadId: string
  files?: FileUIPart[]
}
