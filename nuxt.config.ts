// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // 登入狀態只存在瀏覽器（Firebase Auth），關閉 SSR 避免伺服器端誤判未登入
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '群組預約系統',
      htmlAttrs: { lang: 'zh-Hant' }
    }
  }
})
