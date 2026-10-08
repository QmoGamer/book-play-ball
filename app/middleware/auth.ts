/** 未登入時導向登入頁；在頁面以 definePageMeta({ middleware: 'auth' }) 套用 */
export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth()
  if (!user.value) return navigateTo('/login')
})
