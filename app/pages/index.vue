<script setup lang="ts">
useHead({ title: '首頁月曆 · 群組預約系統' })

const { listFor, isBooked } = useBookings()

const today = new Date()
const todayKey = formatDateKey(today)

const viewYear = ref<number>(today.getFullYear())
const viewMonth = ref<number>(today.getMonth())

const grid = computed<CalendarCell[]>(() => buildMonthGrid(viewYear.value, viewMonth.value))

const MAX_VISIBLE: number = 3

function prevMonth(): void {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value -= 1
  } else {
    viewMonth.value -= 1
  }
}

function nextMonth(): void {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value += 1
  } else {
    viewMonth.value += 1
  }
}

function goToday(): void {
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth()
}

const modalOpen = ref<boolean>(false)
const activeDateKey = ref<string | null>(null)

function openDay(key: string): void {
  activeDateKey.value = key
  modalOpen.value = true
}

const route = useRoute()
onMounted(() => {
  const dateParam = route.query.date
  if (typeof dateParam === 'string') {
    openDay(dateParam)
  }
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
            @click="prevMonth"
          >
            <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <span class="w-28 text-center text-lg font-bold text-slate-900 sm:w-32 sm:text-xl">{{ viewYear }} 年 {{ viewMonth + 1 }} 月</span>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            aria-label="下個月"
            @click="nextMonth"
          >
            <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>
        <button class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" @click="goToday">
          今天
        </button>
      </div>

      <div class="grid grid-cols-7 border-b border-slate-100 text-center text-xs font-semibold text-slate-400 sm:text-sm">
        <div v-for="d in WEEKDAYS" :key="d" class="py-3">{{ d }}</div>
      </div>

      <div class="grid grid-cols-7">
        <div
          v-for="cell in grid"
          :key="cell.key"
          class="min-h-[92px] border-b border-r border-slate-100 p-1.5 transition sm:min-h-[130px] sm:p-2"
          :class="cell.inCurrentMonth ? 'cursor-pointer hover:bg-slate-50' : 'bg-slate-50/60'"
          @click="cell.inCurrentMonth && openDay(cell.key)"
        >
          <div class="flex items-center justify-between">
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold sm:h-7 sm:w-7 sm:text-sm"
              :class="[
                !cell.inCurrentMonth
                  ? 'text-slate-300'
                  : cell.key === todayKey
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700',
              ]"
            >
              {{ cell.day }}
            </span>
            <span
              v-if="cell.inCurrentMonth && listFor(cell.key).length"
              class="h-1.5 w-1.5 rounded-full"
              :class="isBooked(cell.key) ? 'bg-emerald-500' : 'bg-indigo-400'"
            />
          </div>

          <div v-if="cell.inCurrentMonth" class="mt-1.5 space-y-1">
            <div
              v-for="(entry, idx) in listFor(cell.key).slice(0, MAX_VISIBLE)"
              :key="entry.uid"
              class="truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium sm:text-xs"
              :class="[chipStyle(idx).bg, chipStyle(idx).text]"
            >
              {{ entry.name }}
            </div>
            <button
              v-if="listFor(cell.key).length > MAX_VISIBLE"
              class="text-[11px] font-semibold text-emerald-600 hover:underline sm:text-xs"
              @click.stop="openDay(cell.key)"
            >
              +還有 {{ listFor(cell.key).length - MAX_VISIBLE }} 人...
            </button>
          </div>
        </div>
      </div>
    </div>

    <BookingModal v-model="modalOpen" :date-key="activeDateKey" />
  </div>
</template>
