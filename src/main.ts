import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Dialog } from 'vant'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './app.less'

// Vant 桌面端适配
import '@vant/touch-emulator'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router).use(pinia).use(Dialog)

app.mount('#app')
