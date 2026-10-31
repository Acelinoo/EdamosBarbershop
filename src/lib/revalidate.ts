import { revalidatePath } from 'next/cache';

/**
 * Safely calls revalidatePath without throwing an Invariant error
 * when invoked outside of a Next.js server request context (e.g., in unit tests or background scripts).
 */
export function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Safe no-op when outside Next.js request store
  }
}
