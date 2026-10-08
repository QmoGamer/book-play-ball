<script setup lang="ts">
type TabKey = 'upcoming' | 'past'

const TABS: { key: TabKey, label: string, emptyText: string }[] = [
  { key: 'upcoming', label: '📌 即將到來', emptyText: '目前沒有即將到來的預約' },
  { key: 'past', label: '⏳ 已過期', emptyText: '尚無已過期的預約' },
]

useHead({ title: '我的預約 · 群組預約系統' })

definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
const { myBookings, leave } = useBookings()
const toast = useToast()

const activeTab = ref<TabKey>('upcoming')
const cancelingKey = ref<string | null>(null)

const lists = computed(() => (user.value ? myBookings() : { upcoming: [], past: [] }))
const activeTabConfig = computed(() => TABS.find(tab => tab.key === activeTab.value)!)
const isPastTab = computed(() => activeTab.value === 'past')

/** 2026-10-20 -> { month: 10, day: '20', weekday: '二' } */
function rowInfo(key: string) {
  const date = parseDateKey(key)
  return {
    month: date.getMonth() + 1,
    day: pad2(date.getDate()),
    weekday: WEEKDAYS[date.getDay()],
  }
}

async function cancel(key: string) {
  if (cancelingKey.value) return
  cancelingKey.value = key
  try {
    await leave(key)
    toast.success(`已取消 ${formatDateLabel(key)} 的預約`)
  } catch (error) {
    toast.error(`取消失敗：${errorMessage(error)}`)
  } finally {
    cancelingKey.value = null
  }
}
</script>

<template>
  <div v-if="user" class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <p class="text-xs font-bold tracking-widest text-emerald-600">YOUR ACTIVITY</p>
    <h1 class="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">我的預約</h1>
    <p class="mt-2 text-slate-500">整理你的球局，不錯過每一場好手感。</p>

    <div class="mt-8 flex gap-6 border-b border-slate-200">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        class="flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition"
        :class="activeTab === tab.key ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs" :class="activeTab === tab.key && 'bg-emerald-100 text-emerald-700'">{{ lists[tab.key].length }}</span>
      </button>
    </div>

    <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <p v-if="!lists[activeTab].length" class="p-10 text-center text-sm text-slate-400">{{ activeTabConfig.emptyText }}</p>
      <div
        v-for="key in lists[activeTab]"
        :key="key"
        class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
        :class="isPastTab && 'opacity-70'"
      >
        <div class="flex items-center gap-5">
          <div class="w-14 text-center">
            <p class="text-2xl font-bold" :class="isPastTab ? 'text-slate-500' : 'text-slate-900'">{{ rowInfo(key).day }}</p>
            <p class="text-xs text-slate-400">{{ rowInfo(key).month }}月・週{{ rowInfo(key).weekday }}</p>
          </div>
          <div>
            <p class="font-bold" :class="isPastTab ? 'text-slate-600' : 'text-slate-900'">{{ MOCK_EVENT.title }}</p>
            <p class="text-sm" :class="isPastTab ? 'text-slate-400' : 'text-slate-500'">{{ MOCK_EVENT.time }} · {{ MOCK_EVENT.venue }}</p>
          </div>
        </div>

        <span v-if="isPastTab" class="cursor-not-allowed rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400">已完成</span>
        <button
          v-else
          :disabled="!!cancelingKey"
          class="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100 disabled:cursor-wait disabled:opacity-60"
          @click="cancel(key)"
        >
          <template v-if="cancelingKey === key">
            <AppSpinner />
            取消中…
          </template>
          <template v-else>❌ 取消預約</template>
        </button>
      </div>
    </div>
  </div>
</template>
