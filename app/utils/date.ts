export const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/** 2026-10-20 -> 當地時間的 Date 物件 */
export function parseDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y!, m! - 1, d)
}

/** 2026-10-20 -> 10/20 */
export function formatDateLabel(key: string) {
  const [, m, d] = key.split('-').map(Number)
  return `${m}/${d}`
}

export function addDays(date: Date, amount: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

export interface CalendarCell {
  date: Date
  key: string
  day: number
  inCurrentMonth: boolean
}

/** Builds a Sunday-start month grid, padded with adjacent-month days to fill whole weeks. */
export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const gridStart = addDays(firstOfMonth, -startWeekday)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7

  return Array.from({ length: totalCells }, (_, i) => {
    const date = addDays(gridStart, i)
    return {
      date,
      key: formatDateKey(date),
      day: date.getDate(),
      inCurrentMonth: date.getMonth() === month,
    }
  })
}
