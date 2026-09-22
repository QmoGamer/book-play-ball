<script setup lang="ts">
useHead({ title: '我的預約 · 群組預約系統' })

definePageMeta({
  middleware: [
    () => {
      const { user } = useAuth()
      if (!user.value) return navigateTo('/login')
    },
  ],
})

const { user } = useAuth()
const { myBookings, leave } = useBookings()

const activeTab = ref<'upcoming' | 'past'>('upcoming')

const lists = computed(() => (user.value ? myBookings(user.value.name) : { upcoming: [], past: [] }))

function rowInfo(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y!, m! - 1, d)
  return { month: m, day: String(d).padStart(2, '0'), weekday: WEEKDAYS[date.getDay()] }
}

function cancel(key: string) {
  if (user.value) leave(key, user.value.name)
}
</script>

<template>
  <div v-if="user" class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <p class="text-xs font-bold tracking-widest text-emerald-600">YOUR ACTIVITY</p>
    <h1 class="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">我的預約</h1>
    <p class="mt-2 text-slate-500">整理你的球局，不錯過每一場好手感。</p>

    <div class="mt-8 flex gap-6 border-b border-slate-200">
      <button
        class="flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition"
        :class="activeTab === 'upcoming' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
        @click="activeTab = 'upcoming'"
      >
        📌 即將到來
        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs" :class="activeTab === 'upcoming' && 'bg-emerald-100 text-emerald-700'">{{ lists.upcoming.length }}</span>
      </button>
      <button
        class="flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition"
        :class="activeTab === 'past' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
        @click="activeTab = 'past'"
      >
        ⏳ 已過期
        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs" :class="activeTab === 'past' && 'bg-emerald-100 text-emerald-700'">{{ lists.past.length }}</span>
      </button>
    </div>

    <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <template v-if="activeTab === 'upcoming'">
        <p v-if="!lists.upcoming.length" class="p-10 text-center text-sm text-slate-400">目前沒有即將到來的預約</p>
        <div v-for="key in lists.upcoming" :key="key" class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0">
          <div class="flex items-center gap-5">
            <div class="w-14 text-center">
              <p class="text-2xl font-bold text-slate-900">{{ rowInfo(key).day }}</p>
              <p class="text-xs text-slate-400">{{ rowInfo(key).month }}月・週{{ rowInfo(key).weekday }}</p>
            </div>
            <div>
              <p class="font-bold text-slate-900">{{ MOCK_EVENT.title }}</p>
              <p class="text-sm text-slate-500">{{ MOCK_EVENT.time }} · {{ MOCK_EVENT.venue }}</p>
            </div>
          </div>
          <button class="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100" @click="cancel(key)">
            ❌ 取消預約
          </button>
        </div>
      </template>

      <template v-else>
        <p v-if="!lists.past.length" class="p-10 text-center text-sm text-slate-400">尚無已過期的預約</p>
        <div v-for="key in lists.past" :key="key" class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0 opacity-70">
          <div class="flex items-center gap-5">
            <div class="w-14 text-center">
              <p class="text-2xl font-bold text-slate-500">{{ rowInfo(key).day }}</p>
              <p class="text-xs text-slate-400">{{ rowInfo(key).month }}月・週{{ rowInfo(key).weekday }}</p>
            </div>
            <div>
              <p class="font-bold text-slate-600">{{ MOCK_EVENT.title }}</p>
              <p class="text-sm text-slate-400">{{ MOCK_EVENT.time }} · {{ MOCK_EVENT.venue }}</p>
            </div>
          </div>
          <span class="cursor-not-allowed rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400">已完成</span>
        </div>
      </template>
    </div>
  </div>
</template>
