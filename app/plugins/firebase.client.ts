import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

export default defineNuxtPlugin({
  name: 'firebase',
  setup() {
    const firebaseConfig = {
      apiKey: "AIzaSyD0kH_FuPEX-vnpzdbO5Bkupz2daXFMaCY",
      authDomain: "qmo-prod-1.firebaseapp.com",
      projectId: "qmo-prod-1",
      storageBucket: "qmo-prod-1.firebasestorage.app",
      messagingSenderId: "354515708719",
      appId: "1:354515708719:web:0f9b8dc47feef428164fda"
    }

    // 初始化 Firebase
    const app = initializeApp(firebaseConfig)

    // 導出資料庫 (Db) 與登入功能 (Auth)，讓全站皆可呼叫
    return {
      provide: {
        fbAuth: getAuth(app),
        fbDb: getFirestore(app)
      }
    }
  },
})
