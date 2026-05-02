import type { MessageAttachment } from '#/services/api/types'
import type { FileUIPart } from 'ai'

/**
 * Converts UI attachment parts (blob: or data: URLs) into `File` instances for multipart upload.
 */
export async function fileUIPartsToFiles(parts: FileUIPart[]): Promise<File[]> {
  const out: File[] = []
  for (const part of parts) {
    if (!part.url) continue
    const name = part.filename ?? 'attachment'
    const type = part.mediaType || 'application/octet-stream'

    if (part.url.startsWith('blob:') || part.url.startsWith('data:')) {
      const res = await fetch(part.url)
      const blob = await res.blob()
      out.push(new File([blob], name, { type: type || blob.type }))
      continue
    }

    try {
      const res = await fetch(part.url)
      const blob = await res.blob()
      out.push(new File([blob], name, { type: type || blob.type }))
    } catch {
      /* skip unreadable */
    }
  }
  return out
}

/** Parts the backend treats as images for `image` multipart field. */
export function imageFileUIParts(parts: FileUIPart[]): FileUIPart[] {
  return parts.filter((p) => typeof p.mediaType === 'string' && p.mediaType.startsWith('image/'))
}

export function fileUIPartsToMessageAttachments(parts: FileUIPart[]): MessageAttachment[] {
  return parts
    .filter((p): p is FileUIPart & { url: string } => Boolean(p.url))
    .map((p) => ({
      url: p.url,
      mediaType: p.mediaType,
      filename: p.filename,
    }))
}
