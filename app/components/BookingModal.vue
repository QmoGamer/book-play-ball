<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  dateKey: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { user } = useAuth()
const { listFor, isBooked, join, leave } = useBookings()
const router = useRouter()
const toast = useToast()
const pending = ref(false)
const pendingLabel = ref('')

const participants = computed(() => (props.dateKey ? listFor(props.dateKey) : []))
const isMineBooked = computed(() => (props.dateKey ? isBooked(props.dateKey) : false))

const WEEKDAY_LABELS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

const weekdayLabel = computed(() => (props.dateKey ? WEEKDAY_LABELS[parseDateKey(props.dateKey).getDay()] : ''))

const primaryLabel = computed(() => {
  if (!user.value) return '前往登入 →'
  return isMineBooked.value ? '❌ 取消我的預約' : '確認預約這天'
})

const hintText = computed(() => (user.value
  ? '你可以隨時在「我的預約」中管理已加入的日期'
  : '登入後即可預約這天，和大家一起揮拍。'))

function close() {
  emit('update:modelValue', false)
}

async function handlePrimaryAction() {
  if (!props.dateKey) return

  if (!user.value) {
    const dateKey = props.dateKey
    close()
    router.push({ path: '/login', query: { redirect: '/', date: dateKey } })
    return
  }

  if (pending.value) return
  pending.value = true
  // 動作開始時就記住，避免同步資料先回來讓按鈕文字提早翻轉
  const wasBooked = isMineBooked.value
  pendingLabel.value = wasBooked ? '取消中…' : '預約中…'
  const dateLabel = formatDateLabel(props.dateKey)
  try {
    if (wasBooked) {
      await leave(props.dateKey)
      toast.success(`已取消 ${dateLabel} 的預約`)
    } else {
      await join(props.dateKey)
      toast.success(`已預約 ${dateLabel}，到時候見！`)
    }
    close()
  } catch (error) {
    toast.error(`${wasBooked ? '取消' : '預約'}失敗：${errorMessage(error)}`)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue && dateKey"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        @click.self="close"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-7">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-bold tracking-widest text-emerald-600">{{ weekdayLabel }} · OPEN PLAY</p>
              <h3 class="mt-1 text-xl font-bold text-slate-900">{{ dateKey }} 預約詳情</h3>
            </div>
            <button
              class="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="關閉"
              @click="close"
            >
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            </button>
          </div>

          <p class="mt-2 text-sm text-slate-500">已有 {{ participants.length }} 位球友加入這場練習</p>

          <div v-if="participants.length" class="mt-4 max-h-64 divide-y divide-slate-100 overflow-y-auto border-t border-slate-100">
            <div v-for="(entry, idx) in participants" :key="entry.uid" class="flex items-center justify-between py-3">
              <div class="flex items-center gap-3">
                <span
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  :class="chipStyle(idx).avatarBg"
                >
                  {{ entry.name.charAt(0) }}
                </span>
                <span class="text-sm font-medium text-slate-800">
                  {{ entry.name }}
                  <span v-if="user && entry.uid === user.uid" class="ml-1 text-xs font-semibold text-emerald-600">你</span>
                </span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5 text-emerald-500"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </div>
          </div>
          <div v-else class="mt-4 border-t border-slate-100" />

          <button
            :disabled="pending"
            class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition disabled:cursor-wait disabled:opacity-70"
            :class="isMineBooked ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'"
            @click="handlePrimaryAction"
          >
            <template v-if="pending">
              <AppSpinner />
              {{ pendingLabel }}
            </template>
            <template v-else>{{ primaryLabel }}</template>
          </button>
          <p class="mt-3 text-center text-xs text-slate-400">
            {{ hintText }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
