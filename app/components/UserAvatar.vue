<script setup lang="ts">
defineProps<{
  name: string
  color: string
}>()
</script>

<template>
  <span
    class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
    :style="{ backgroundColor: color }"
  >
    {{ name.charAt(0) }}
  </span>
</template>
