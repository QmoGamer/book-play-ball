/** 啟動時開始即時同步預約資料，所有頁面共用同一份 */
export default defineNuxtPlugin({
  name: 'bookings',
  dependsOn: ['firebase'],
  setup() {
    useBookings().startSync()
  },
})
