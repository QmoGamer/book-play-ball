import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, type Timestamp, type Unsubscribe } from 'firebase/firestore'

export const MOCK_EVENT = {
  title: '群組公開練球',
  time: '晚間 19:00',
  venue: '城市運動中心',
}

export interface BookingEntry {
  uid: string
  name: string
}

/** Firestore bookings/{date}_{uid} 文件結構；一筆預約一份文件 */
interface BookingDoc {
  date: string
  uid: string
  name: string
  createdAt: Timestamp | null
}

function bookingId(key: string, uid: string): string {
  return `${key}_${uid}`
}

/** 共用的預約月曆：date key -> 依報名先後排序的參加者 */
export function useBookings() {
  const bookings = useState<Record<string, BookingEntry[]>>('bookings', () => ({}))
  const { $fbDb } = useNuxtApp()
  const { user } = useAuth()

  /** 即時同步全部預約；由 bookings plugin 在啟動時呼叫一次 */
  function startSync(): Unsubscribe {
    return onSnapshot(
      collection($fbDb, 'bookings'),
      (snapshot) => {
        const docs = snapshot.docs
          .map(d => d.data({ serverTimestamps: 'estimate' }) as BookingDoc)
          .sort((a, b) => (a.createdAt?.toMillis() ?? 0) - (b.createdAt?.toMillis() ?? 0))

        const map: Record<string, BookingEntry[]> = {}
        for (const { date, uid, name } of docs) {
          (map[date] ??= []).push({ uid, name })
        }
        bookings.value = map
      },
      error => console.error('[bookings] 同步預約資料失敗', error),
    )
  }

  function listFor(key: string): BookingEntry[] {
    return bookings.value[key] ?? []
  }

  /** 目前登入的使用者是否已預約這天 */
  function isBooked(key: string): boolean {
    return !!user.value && listFor(key).some(entry => entry.uid === user.value!.uid)
  }

  async function join(key: string) {
    if (!user.value || isBooked(key)) return
    const { uid, name } = user.value
    await setDoc(doc($fbDb, 'bookings', bookingId(key, uid)), {
      date: key,
      uid,
      name,
      createdAt: serverTimestamp(),
    })
  }

  async function leave(key: string) {
    if (!user.value) return
    await deleteDoc(doc($fbDb, 'bookings', bookingId(key, user.value.uid)))
  }

  /** 目前登入使用者的預約，分成即將到來與已結束 */
  function myBookings() {
    const todayKey = formatDateKey(new Date())
    const upcoming: string[] = []
    const past: string[] = []

    for (const key of Object.keys(bookings.value).sort()) {
      if (!isBooked(key)) continue
      if (key >= todayKey) upcoming.push(key)
      else past.push(key)
    }
    past.reverse()
    return { upcoming, past }
  }

  return { bookings, startSync, listFor, isBooked, join, leave, myBookings }
}
