<script setup lang="ts">
interface NavLink {
  to: string
  label: string
}

const { user, logout } = useAuth()
const route = useRoute()
const toast = useToast()

const mobileOpen = ref(false)
const loggingOut = ref(false)

const navLinks = computed<NavLink[]>(() => [
  { to: '/', label: '首頁月曆' },
  ...(user.value ? [{ to: '/my-bookings', label: '我的預約' }] : []),
])

watch(() => route.fullPath, () => {
  mobileOpen.value = false
})

async function handleLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await logout()
    toast.success('已登出')
  } catch (error) {
    toast.error(`登出失敗：${errorMessage(error)}`)
  } finally {
    loggingOut.value = false
  }
  mobileOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <AppLogoIcon class="shadow-sm" />
        <span class="whitespace-nowrap text-base font-bold text-slate-900 sm:text-lg">
          群組<span class="text-emerald-600">預約系統</span>
        </span>
      </NuxtLink>

      <div class="hidden items-center gap-8 md:flex">
        <nav class="flex items-center gap-8">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="relative py-1 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            active-class="!text-slate-900 after:absolute after:-bottom-[21px] after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-emerald-600"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <NuxtLink
          v-if="!user"
          to="/login"
          class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          登入
        </NuxtLink>
        <div v-else class="group relative">
          <button class="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-slate-100">
            <UserAvatar :name="user.name" :color="user.color" />
            <span class="text-sm font-semibold text-slate-800">{{ user.name }}</span>
          </button>
          <div class="invisible absolute right-0 top-full z-40 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100">
            <div class="whitespace-nowrap rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              <!-- 個人設定頁暫時隱藏 -->
              <!-- <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">個人設定</NuxtLink> -->
              <button :disabled="loggingOut" class="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 disabled:opacity-60" @click="handleLogout">{{ loggingOut ? '登出中…' : '登出' }}</button>
            </div>
          </div>
        </div>
      </div>

      <button
        class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
        aria-label="開啟選單"
        @click="mobileOpen = !mobileOpen"
      >
        <svg v-if="!mobileOpen" viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      </button>
    </div>

    <div v-if="mobileOpen" class="absolute inset-x-0 top-full border-t border-slate-100 bg-white px-4 pb-4 shadow-lg md:hidden">
      <nav class="flex flex-col py-2">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-600"
          active-class="bg-emerald-50 !text-emerald-700"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <div class="mt-2 border-t border-slate-100 pt-3">
        <NuxtLink
          v-if="!user"
          to="/login"
          class="block rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
        >
          登入
        </NuxtLink>
        <div v-else class="flex items-center justify-between px-2">
          <div class="flex items-center gap-2">
            <UserAvatar :name="user.name" :color="user.color" />
            <span class="text-sm font-semibold text-slate-800">{{ user.name }}</span>
          </div>
          <button :disabled="loggingOut" class="text-sm font-semibold text-red-500 disabled:opacity-60" @click="handleLogout">{{ loggingOut ? '登出中…' : '登出' }}</button>
        </div>
      </div>
    </div>
  </header>
</template>
