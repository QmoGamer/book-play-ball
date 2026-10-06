<script setup lang="ts">
useHead({ title: '個人設定 · 群組預約系統' })

definePageMeta({
  middleware: [
    // 個人設定頁暫時隱藏，直接導回首頁；恢復時移除這段即可
    () => navigateTo('/'),
    () => {
      const { user } = useAuth()
      if (!user.value) return navigateTo('/login')
    },
  ],
})

const { user, updateName, updateColor } = useAuth()

const displayName = ref<string>(user.value?.name ?? '')
watch(
  () => user.value?.name,
  (name: string | undefined) => {
    if (name) displayName.value = name
  },
)

const displayColor = ref<string>(user.value?.color ?? '#10b981')
watch(
  () => user.value?.color,
  (color: string | undefined) => {
    if (color) displayColor.value = color
  },
)

const newPassword = ref<string>('')
const confirmPassword = ref<string>('')
const saveMessage = ref<string>('')
const passwordError = ref<string>('')

async function saveAll() {
  passwordError.value = ''
  saveMessage.value = ''

  if (newPassword.value || confirmPassword.value) {
    if (newPassword.value.length < 6) {
      passwordError.value = '密碼長度至少需要 6 個字元'
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      passwordError.value = '兩次輸入的密碼不一致'
      return
    }
  }

  try {
    if (displayName.value.trim()) await updateName(displayName.value)
    await updateColor(displayColor.value)
  } catch (error: any) {
    useToast().error(`儲存失敗：${error.message}`)
    return
  }
  newPassword.value = ''
  confirmPassword.value = ''

  saveMessage.value = '設定已儲存'
  setTimeout(() => (saveMessage.value = ''), 2000)
}
</script>

<template>
  <div v-if="user" class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <p class="text-xs font-bold tracking-widest text-emerald-600">ACCOUNT SETTINGS</p>
    <h1 class="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">個人設定</h1>
    <p class="mt-2 text-slate-500">管理你的公開資料與登入安全。</p>

    <div class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div class="flex items-center gap-4">
        <span
          class="flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold text-white"
          :style="{ backgroundColor: user.color }"
        >
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
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">顯示姓名</label>
          <input
            v-model="displayName"
            type="text"
            class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
        </div>
      </div>

      <div class="my-7 border-t border-slate-100" />

      <div class="grid gap-4 sm:grid-cols-[200px_1fr]">
        <div>
          <p class="font-semibold text-slate-800">代表色</p>
          <p class="mt-1 text-sm text-slate-400">用於顯示你的頭像顏色。</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">選擇顏色</label>
          <div class="flex items-center gap-2.5">
            <input
              v-model="displayColor"
              type="color"
              class="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 p-1"
            >
            <input
              v-model="displayColor"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
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
          <p v-if="passwordError" class="mt-2 text-xs font-medium text-red-500">{{ passwordError }}</p>
        </div>
      </div>

      <div class="my-7 border-t border-slate-100" />

      <div class="flex items-center justify-end gap-3">
        <p v-if="saveMessage" class="text-xs font-medium text-emerald-600">{{ saveMessage }}</p>
        <button
          class="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          @click="saveAll"
        >
          儲存
        </button>
      </div>
    </div>
  </div>
</template>
