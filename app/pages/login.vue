<script setup lang="ts">
interface RedirectTarget {
  path: string
  query?: { date: string }
}

definePageMeta({ layout: 'blank' })

useHead({ title: '登入 · 群組預約系統' })

const { user, login } = useAuth()
const route = useRoute()
const router = useRouter()

function redirectTarget(): RedirectTarget {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  const date = typeof route.query.date === 'string' ? route.query.date : undefined
  return { path: redirect, query: date ? { date } : undefined }
}

onMounted(() => {
  if (user.value) {
    router.replace(redirectTarget())
  }
})

const mode = ref<'login' | 'register'>('login')
const isRegister = computed<boolean>(() => mode.value === 'register')

const nickname = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

function submit(): void {
  login(nickname.value)
  router.push(redirectTarget())
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div class="flex items-center gap-2.5">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl text-white transition"
          :class="isRegister ? 'bg-indigo-600' : 'bg-emerald-600'"
        >
          <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5L19 19M19 5l-2.5 2.5M7.5 16.5L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </span>
        <span class="text-base font-bold text-slate-900">群組預約系統</span>
      </div>

      <p class="mt-8 text-xs font-bold tracking-widest" :class="isRegister ? 'text-indigo-600' : 'text-emerald-600'">
        {{ isRegister ? 'CREATE ACCOUNT' : 'WELCOME BACK' }}
      </p>
      <h1 class="mt-1 text-2xl font-bold text-slate-900">{{ isRegister ? '建立你的帳號' : '歡迎回來' }}</h1>
      <p class="mt-2 text-sm text-slate-500">
        {{ isRegister ? '加入球局，和大家一起享受每一次揮拍。' : '登入後即可加入球局，和大家一起揮拍。' }}
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">暱稱</label>
          <input
            v-model="nickname"
            type="text"
            placeholder="輸入暱稱"
            required
            class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:ring-2"
            :class="isRegister ? 'focus:border-indigo-500 focus:ring-indigo-100' : 'focus:border-emerald-500 focus:ring-emerald-100'"
          >
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">密碼</label>
          <input
            v-model="password"
            type="password"
            :placeholder="isRegister ? '設定密碼' : '輸入密碼'"
            required
            class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:ring-2"
            :class="isRegister ? 'focus:border-indigo-500 focus:ring-indigo-100' : 'focus:border-emerald-500 focus:ring-emerald-100'"
          >
        </div>
        <div v-if="isRegister">
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">確認密碼</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="再次輸入密碼"
            required
            class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
        </div>

        <button
          type="submit"
          class="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition"
          :class="isRegister ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'"
        >
          {{ isRegister ? '建立帳號' : '登入' }} →
        </button>
      </form>

      <p class="mt-5 text-center text-sm text-slate-500">
        {{ isRegister ? '已經有帳號？' : '還沒有帳號？' }}
        <button
          type="button"
          class="font-semibold"
          :class="isRegister ? 'text-indigo-600' : 'text-emerald-600'"
          @click="mode = isRegister ? 'login' : 'register'"
        >
          {{ isRegister ? '返回登入' : '立即註冊' }}
        </button>
      </p>
    </div>
  </div>
</template>
