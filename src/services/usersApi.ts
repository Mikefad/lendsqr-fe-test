import type { User } from '../types/user'

const MOCK_API_URL = '/mock/users.json'

export async function fetchUsers(signal?: AbortSignal, delayMs = 600): Promise<User[]> {
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, delayMs)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      reject(new DOMException('Request aborted', 'AbortError'))
    }, { once: true })
  })

  const response = await fetch(MOCK_API_URL, { signal })

  if (!response.ok) {
    throw new Error(`Unable to load users (${response.status})`)
  }

  const users: unknown = await response.json()

  if (!Array.isArray(users)) {
    throw new Error('The users response is not valid')
  }

  return users as User[]
}
