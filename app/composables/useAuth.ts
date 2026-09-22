export interface AppUser {
  name: string
  joinedAt: string
  color: string
}

const DEFAULT_NAME = '王小明'
const DEFAULT_JOINED_AT = '2026 年 8 月'
const DEFAULT_COLOR = '#10b981'

/** Mock session store — no backend, just enough state to demo the UI flows. */
export function useAuth() {
  const user = useState<AppUser | null>('auth-user', () => null)

  function login(nickname: string) {
    user.value = { name: nickname.trim() || DEFAULT_NAME, joinedAt: DEFAULT_JOINED_AT, color: DEFAULT_COLOR }
  }

  function logout() {
    user.value = null
  }

  function updateName(name: string) {
    if (user.value && name.trim()) {
      user.value = { ...user.value, name: name.trim() }
    }
  }

  function updateColor(color: string) {
    if (user.value && color.trim()) {
      user.value = { ...user.value, color }
    }
  }

  return { user, login, logout, updateName, updateColor }
}
