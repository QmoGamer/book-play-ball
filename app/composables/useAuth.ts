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
    const snapshot = await getDoc(doc($fbDb, 'users', fbUser.uid))
    // 已登入但還沒寫過暱稱，視同未登入，讓使用者到登入頁補填
    user.value = snapshot.exists() ? toAppUser(snapshot.data() as UserDoc) : null
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
    const exists = !isNewUser && (await getDoc(ref)).exists()
    const data: UserDoc = exists
      ? { uid, name }
      : { uid, name, color: DEFAULT_COLOR, createdAt: new Date().toISOString() }
    await setDoc(ref, data, { merge: true })

    await syncUser(credential.user)
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
