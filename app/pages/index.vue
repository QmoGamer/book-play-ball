<script setup lang="ts">
useHead({ title: '首頁月曆 · 群組預約系統' })

const MAX_VISIBLE = 3

const { listFor, isBooked } = useBookings()
const route = useRoute()

const today = new Date()
const todayKey = formatDateKey(today)

const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

/** 月曆格子，附上當天的參加名單 */
const cells = computed(() => buildMonthGrid(viewYear.value, viewMonth.value).map(cell => ({
  ...cell,
  entries: listFor(cell.key),
  booked: isBooked(cell.key),
  // 早於今天的日期不能預約
  disabled: !cell.inCurrentMonth || cell.key < todayKey,
})))

function showMonth(date: Date) {
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}

function shiftMonth(delta: number) {
  showMonth(new Date(viewYear.value, viewMonth.value + delta, 1))
}

function dayNumberClass(cell: CalendarCell) {
  if (!cell.inCurrentMonth || cell.key < todayKey) return 'text-slate-300'
  return cell.key === todayKey ? 'bg-emerald-600 text-white' : 'text-slate-700'
}

const modalOpen = ref(false)
const activeDateKey = ref<string | null>(null)

function openDay(key: string) {
  if (key < todayKey) return
  activeDateKey.value = key
  modalOpen.value = true
}

// 從登入頁導回時，自動打開原本點選的日期
onMounted(() => {
  const dateParam = route.query.date
  if (typeof dateParam === 'string') openDay(dateParam)
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <p class="text-xs font-bold tracking-widest text-emerald-600">GROUP BOARD · 共享看板</p>
    <h1 class="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">大家什麼時候打球？</h1>
    <p class="mt-2 text-slate-500">選擇一天，看看誰已經預約，一起組隊開打。</p>

    <div class="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
        <div class="flex items-center gap-2">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            aria-label="上個月"
            @click="shiftMonth(-1)"
          >
            <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <span class="w-28 text-center text-lg font-bold text-slate-900 sm:w-32 sm:text-xl">{{ viewYear }} 年 {{ viewMonth + 1 }} 月</span>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            aria-label="下個月"
            @click="shiftMonth(1)"
          >
            <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>
        <button class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" @click="showMonth(today)">
          今天
        </button>
      </div>

      <div class="grid grid-cols-7 border-b border-slate-100 text-center text-xs font-semibold text-slate-400 sm:text-sm">
        <div v-for="d in WEEKDAYS" :key="d" class="py-3">{{ d }}</div>
      </div>

      <div class="grid grid-cols-7">
        <div
          v-for="cell in cells"
          :key="cell.key"
          class="min-h-[92px] border-b border-r border-slate-100 p-1.5 transition sm:min-h-[130px] sm:p-2"
          :class="cell.disabled ? 'cursor-not-allowed bg-slate-50/60' : 'cursor-pointer hover:bg-slate-50'"
          :aria-disabled="cell.disabled"
          @click="!cell.disabled && openDay(cell.key)"
        >
          <div class="flex items-center justify-between">
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold sm:h-7 sm:w-7 sm:text-sm"
              :class="dayNumberClass(cell)"
            >
              {{ cell.day }}
            </span>
            <span
              v-if="cell.inCurrentMonth && cell.entries.length"
              class="h-1.5 w-1.5 rounded-full"
              :class="cell.booked ? 'bg-emerald-500' : 'bg-indigo-400'"
            />
          </div>

          <div v-if="cell.inCurrentMonth" class="mt-1.5 space-y-1" :class="{ 'opacity-50': cell.disabled }">
            <div
              v-for="(entry, idx) in cell.entries.slice(0, MAX_VISIBLE)"
              :key="entry.uid"
              class="truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium sm:text-xs"
              :class="[chipStyle(idx).bg, chipStyle(idx).text]"
            >
              {{ entry.name }}
            </div>
            <button
              v-if="cell.entries.length > MAX_VISIBLE"
              :disabled="cell.disabled"
              class="text-[11px] font-semibold text-emerald-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline sm:text-xs"
              @click.stop="openDay(cell.key)"
            >
              +還有 {{ cell.entries.length - MAX_VISIBLE }} 人...
            </button>
          </div>
        </div>
      </div>
    </div>

    <BookingModal v-model="modalOpen" :date-key="activeDateKey" />
  </div>
</template>
