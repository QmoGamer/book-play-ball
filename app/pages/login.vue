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
const toast = useToast()

const nickname = ref('')
const submitting = ref(false)

/** 登入後導回原本的頁面，並保留原本點選的日期 */
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

async function submit() {
  if (submitting.value) return
  submitting.value = true
  try {
    await login(nickname.value)
    if (user.value) {
      toast.success(`歡迎，${user.value.name}！`)
      await router.push(redirectTarget())
    }
  } catch (error) {
    toast.error(`登入失敗：${errorMessage(error)}`)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div class="flex items-center gap-2.5">
        <AppLogoIcon />
        <span class="text-base font-bold text-slate-900">群組預約系統</span>
      </div>

      <p class="mt-8 text-xs font-bold tracking-widest text-emerald-600">WELCOME</p>
      <h1 class="mt-1 text-2xl font-bold text-slate-900">輸入暱稱開始</h1>
      <p class="mt-2 text-sm text-slate-500">不用註冊，輸入暱稱即可加入球局，和大家一起揮拍。</p>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label for="nickname" class="mb-1.5 block text-sm font-semibold text-slate-700">暱稱</label>
          <input
            id="nickname"
            v-model="nickname"
            type="text"
            placeholder="輸入暱稱"
            required
            :disabled="submitting"
            class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
        >
          <template v-if="submitting">
            <AppSpinner />
            登入中…
          </template>
          <template v-else>開始 →</template>
        </button>
      </form>
    </div>
  </div>
</template>
