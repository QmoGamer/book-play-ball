# VERSION-LOG

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
