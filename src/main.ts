import '@/styles/common.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { worker } from '@/mocks/browser'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

worker.start({
  // 只匹配 /cat-admin-api 开头的请求，其他请求直接放行
  onUnhandledRequest(req, print) {
    if (req.url.includes('/cat-admin-api')) {
      print.warning()
    }
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
