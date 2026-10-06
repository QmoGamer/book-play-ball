import { onAuthStateChanged } from 'firebase/auth'

/** 啟動時等 Firebase 還原登入狀態後才繼續，確保 route middleware 能拿到正確的 user */
export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['firebase'],
  async setup(nuxtApp) {
    const { syncUser } = useAuth()

    await new Promise<void>((resolve) => {
      onAuthStateChanged(nuxtApp.$fbAuth, async (fbUser) => {
        try {
          await syncUser(fbUser)
        } catch (error) {
          console.error('[auth] 讀取使用者資料失敗', error)
        }
        resolve()
      })
    })
  },
})
