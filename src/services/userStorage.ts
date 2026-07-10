import type { User } from '../types/user'

export const SELECTED_USER_STORAGE_KEY = 'lendsqr-selected-user'

export function saveSelectedUser(user: User) {
  localStorage.setItem(SELECTED_USER_STORAGE_KEY, JSON.stringify(user))
}

export function getSelectedUser(): User | null {
  const storedUser = localStorage.getItem(SELECTED_USER_STORAGE_KEY)
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as User
  } catch {
    localStorage.removeItem(SELECTED_USER_STORAGE_KEY)
    return null
  }
}
