export const MOCK_EVENT = {
  title: '群組公開練球',
  time: '晚間 19:00',
  venue: '城市運動中心',
}

/** Seed data anchored to "today" (by offset) so upcoming/past always has content, whenever this runs. */
function seedBookings(): Record<string, string[]> {
  const today = new Date()
  const offsets: Array<[number, string[]]> = [
    [-21, ['王小明', '李大同']],
    [-14, ['陳小華']],
    [-7, ['王小明', '陳小華']],
    [2, ['王小明', '李大同', '陳小華', '林雅婷', '周志偉', '張庭瑋']],
    [5, ['陳小華']],
    [9, ['王小明', '林雅婷', '周志偉']],
    [12, ['李大同', '陳小華', '林雅婷', '周志偉']],
    [16, ['張庭瑋']],
    [20, ['王小明', '陳小華', '林雅婷']],
    [25, ['王小明']],
  ]

  const map: Record<string, string[]> = {}
  for (const [offset, names] of offsets) {
    map[formatDateKey(addDays(today, offset))] = [...names]
  }
  return map
}

/** Mock shared calendar store — one flat map of date key -> attendee names. */
export function useBookings() {
  const bookings = useState<Record<string, string[]>>('bookings', () => seedBookings())

  function listFor(key: string): string[] {
    return bookings.value[key] ?? []
  }

  function isBooked(key: string, name: string): boolean {
    return listFor(key).includes(name)
  }

  function join(key: string, name: string) {
    const list = listFor(key)
    if (!list.includes(name)) {
      bookings.value = { ...bookings.value, [key]: [...list, name] }
    }
  }

  function leave(key: string, name: string) {
    bookings.value = { ...bookings.value, [key]: listFor(key).filter(n => n !== name) }
  }

  function myBookings(name: string) {
    const todayKey = formatDateKey(new Date())
    const upcoming: string[] = []
    const past: string[] = []

    for (const key of Object.keys(bookings.value).sort()) {
      if (!bookings.value[key]!.includes(name)) continue
      if (key >= todayKey) upcoming.push(key)
      else past.push(key)
    }
    past.reverse()
    return { upcoming, past }
  }

  return { bookings, listFor, isBooked, join, leave, myBookings }
}
