# VERSION-LOG

### v0.4.1 - 2026-10-06

- feat(ui): 登入、預約、取消預約、登出按鈕加上載入中狀態並防止重複點擊，避免等待 API 時畫面像卡住
- feat(toast): 新增全站 toast 訊息，取代 alert 並在預約、取消、登入、登出後給予明確回饋
- fix(booking-modal): 預約或取消成功後自動關閉彈窗，讓使用者直接看到月曆更新結果
- feat(app): 新增 SPA 載入畫面，避免等待登入狀態還原時出現空白頁
- fix(auth): 修正首次登入時背景還原身分與登入流程同時進行，可能把剛登入的使用者清空
- perf(auth): 登入時沿用已讀取的使用者資料，減少一次 Firestore 讀取
- refactor(utils): 新增 formatDateLabel 統一 toast 中的日期顯示格式

### v0.4.0 - 2026-10-06

- feat(bookings): 預約資料改存 Firestore 的 bookings 集合，取代寫死的示範資料，讓群組成員的預約真正共用
- feat(bookings): 新增即時同步預約的 plugin，有人預約或取消時所有人不用重新整理就能看到
- refactor(bookings): 預約身分改用 uid 比對，避免同名使用者被誤判為同一人
- fix(booking-modal): 預約或取消失敗時跳出錯誤提示，避免使用者以為已完成操作
- fix(my-bookings): 取消預約失敗時跳出錯誤提示

### v0.3.0 - 2026-10-06

- feat(auth): 改用 Firebase 匿名登入並將暱稱、代表色存入 Firestore，重新整理後仍能維持登入身分
- feat(login): 登入頁簡化為只輸入暱稱，匿名登入不需註冊與密碼
- feat(plugins): 新增 Firebase 初始化與登入狀態還原 plugin，確保頁面權限判斷前已取得使用者
- fix(login): 登入後跳轉保留原本的 date 參數，回到原先查看的日期
- refactor(profile): 個人設定頁暫時隱藏並導回首頁，待匿名登入下的設定項目調整後再開放
- chore(config): 關閉 SSR，避免伺服器端讀不到瀏覽器登入狀態而誤導回登入頁
- chore(deps): 新增 firebase 套件

### v0.2.1 - 2026-09-22

- fix(navbar): 手機版選單改為懸浮在頁面內容上方，展開時不再把頁面往下推

### v0.2.0 - 2026-09-22

- feat(auth): 新增使用者代表色欄位與更新方法，讓頭像可依個人設定顯示顏色
- feat(profile): 個人設定頁新增代表色欄位，可用調色盤挑選頭像顏色
- refactor(profile): 姓名、代表色、密碼改為單一「儲存」按鈕一次送出，取代三個各自的更新按鈕
- fix(navbar): 修正使用者選單與大頭貼間距過大，滑鼠移動時容易脫離觸發區域
- style(navbar): 選單寬度改為依文字內容自動調整，不再固定寬度
- refactor(navbar): 移除導覽列中重複的「個人設定」連結，統一從使用者選單進入
- refactor(auth): 移除尚未串接後端的 Google 登入選項，避免使用者誤以為可直接使用
- feat(layout): 新增無導覽列的 blank 版型，讓登入頁能佔滿整個畫面
- chore(branding): 統一將系統名稱從「群組桌球預約系統」簡化為「群組預約系統」
- style(home): 縮小首頁標題字級並移除月曆下方多餘的圖例說明列
- refactor(types): 為多處 ref、computed、function 補上明確的 TypeScript 型別標註

### v0.1.0 - 2026-09-22

- feat(pages): 建立首頁月曆看板、登入註冊、我的預約、個人設定頁面，群組預約流程完整可用
- feat(components): 新增導覽列與「當日預約名單」彈窗，支援加入／取消預約
- feat(composables): 建立模擬登入狀態與共享預約資料
- chore: 初始化 Nuxt 專案設定與相依套件
