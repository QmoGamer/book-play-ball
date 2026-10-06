import { getAdditionalUserInfo, signInAnonymously, signOut, type User } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export interface AppUser {
  uid: string
  name: string
  joinedAt: string
  color: string
}

/** Firestore users/{uid} 文件結構 */
interface UserDoc {
  uid: string
  name: string
  color?: string
  createdAt?: string
}

const DEFAULT_COLOR = '#10b981'

function formatJoinedAt(iso?: string): string {
  const date = iso ? new Date(iso) : new Date()
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`
}

function toAppUser(data: UserDoc): AppUser {
  return {
    uid: data.uid,
    name: data.name,
    joinedAt: formatJoinedAt(data.createdAt),
    color: data.color ?? DEFAULT_COLOR,
  }
}

/** 以 Firebase 匿名登入為基礎的登入狀態；資料存在 Firestore users 集合 */
export function useAuth() {
  const user = useState<AppUser | null>('auth-user', () => null)
  const { $fbAuth, $fbDb } = useNuxtApp()

  /** 依 Firebase 登入狀態，從 Firestore 讀回使用者資料 */
  async function syncUser(fbUser: User | null) {
    if (!fbUser) {
      user.value = null
      return
    }
    // login() 已經設好同一位使用者時不必重讀，也避免讀到尚未寫入的文件而把 user 清空
    if (user.value?.uid === fbUser.uid) return

    const snapshot = await getDoc(doc($fbDb, 'users', fbUser.uid))
    // 已登入但還沒寫過暱稱，視同未登入，讓使用者到登入頁補填
    if (snapshot.exists()) user.value = toAppUser(snapshot.data() as UserDoc)
  }

  async function login(nickname: string) {
    const name = nickname.trim()
    if (!name) return

    // 同一個瀏覽器會沿用原本的 uid
    const credential = await signInAnonymously($fbAuth)
    const { uid } = credential.user
    const ref = doc($fbDb, 'users', uid)

    // createdAt、color 只在首次建立文件時寫入，之後只更新暱稱
    const isNewUser = getAdditionalUserInfo(credential)?.isNewUser ?? false
    const snapshot = isNewUser ? null : await getDoc(ref)
    const existing = snapshot?.exists() ? (snapshot.data() as UserDoc) : null

    if (existing) {
      await updateDoc(ref, { name })
      user.value = toAppUser({ ...existing, name })
    } else {
      const data: UserDoc = { uid, name, color: DEFAULT_COLOR, createdAt: new Date().toISOString() }
      await setDoc(ref, data)
      user.value = toAppUser(data)
    }
  }

  async function logout() {
    await signOut($fbAuth)
    user.value = null
  }

  async function updateName(name: string) {
    if (!user.value || !name.trim()) return
    await updateDoc(doc($fbDb, 'users', user.value.uid), { name: name.trim() })
    user.value = { ...user.value, name: name.trim() }
  }

  async function updateColor(color: string) {
    if (!user.value || !color.trim()) return
    await updateDoc(doc($fbDb, 'users', user.value.uid), { color })
    user.value = { ...user.value, color }
  }

  return { user, syncUser, login, logout, updateName, updateColor }
}
