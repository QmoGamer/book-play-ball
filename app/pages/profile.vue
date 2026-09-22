<script setup lang="ts">
useHead({ title: '個人設定 · 群組桌球預約系統' })

definePageMeta({
  middleware: [
    () => {
      const { user } = useAuth()
      if (!user.value) return navigateTo('/login')
    },
  ],
})

const { user, updateName } = useAuth()

const displayName = ref(user.value?.name ?? '')
watch(
  () => user.value?.name,
  (name) => {
    if (name) displayName.value = name
  },
)

const nameMessage = ref('')
function saveName() {
  if (!displayName.value.trim()) return
  updateName(displayName.value)
  nameMessage.value = '姓名已更新'
  setTimeout(() => (nameMessage.value = ''), 2000)
}

const newPassword = ref('')
const confirmPassword = ref('')
const passwordMessage = ref('')
const passwordError = ref('')

function changePassword() {
  passwordError.value = ''
  passwordMessage.value = ''

  if (!newPassword.value || newPassword.value.length < 6) {
    passwordError.value = '密碼長度至少需要 6 個字元'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = '兩次輸入的密碼不一致'
    return
  }

  passwordMessage.value = '密碼已更新'
  newPassword.value = ''
  confirmPassword.value = ''
  setTimeout(() => (passwordMessage.value = ''), 2000)
}
</script>

<template>
  <div v-if="user" class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <p class="text-xs font-bold tracking-widest text-emerald-600">ACCOUNT SETTINGS</p>
    <h1 class="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">個人設定</h1>
    <p class="mt-2 text-slate-500">管理你的公開資料與登入安全。</p>

    <div class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div class="flex items-center gap-4">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-semibold text-emerald-700">
          {{ user.name.charAt(0) }}
        </span>
        <div>
          <p class="text-lg font-bold text-slate-900">{{ user.name }}</p>
          <p class="text-sm text-slate-400">加入於 {{ user.joinedAt }}</p>
        </div>
      </div>

      <div class="my-7 border-t border-slate-100" />

      <div class="grid gap-4 sm:grid-cols-[200px_1fr]">
        <div>
          <p class="font-semibold text-slate-800">基本資料</p>
          <p class="mt-1 text-sm text-slate-400">這些資料會顯示在群組名單中。</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div class="flex-1">
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">顯示姓名</label>
            <input
              v-model="displayName"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
          </div>
          <div class="flex flex-col items-start gap-1.5 sm:pt-6">
            <button
              class="rounded-lg border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
              @click="saveName"
            >
              更新姓名
            </button>
            <p v-if="nameMessage" class="text-xs font-medium text-emerald-600">{{ nameMessage }}</p>
          </div>
        </div>
      </div>

      <div class="my-7 border-t border-slate-100" />

      <div class="grid gap-4 sm:grid-cols-[200px_1fr]">
        <div>
          <p class="font-semibold text-slate-800">登入安全</p>
          <p class="mt-1 text-sm text-slate-400">定期更新密碼，保護你的帳戶。</p>
        </div>
        <div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">新密碼</label>
              <input
                v-model="newPassword"
                type="password"
                placeholder="輸入新密碼"
                class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">確認新密碼</label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="再次輸入新密碼"
                class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
            </div>
          </div>
          <div class="mt-4 flex flex-col items-start gap-1.5">
            <button
              class="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="changePassword"
            >
              變更密碼
            </button>
            <p v-if="passwordMessage" class="text-xs font-medium text-emerald-600">{{ passwordMessage }}</p>
            <p v-if="passwordError" class="text-xs font-medium text-red-500">{{ passwordError }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
