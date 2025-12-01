import '@/styles/common.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import { worker } from '@/mocks/browser'
import { initData } from '@/mocks/db/initData'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 启动 MSW worker 并初始化 IndexedDB 数据
async function startApp() {
  // 启动 MSW worker
  await worker.start({
    // 只匹配 /cat-admin-api 开头的请求，其他请求直接放行
    onUnhandledRequest(req, print) {
      if (req.url.includes('/cat-admin-api')) {
        print.warning()
      }
    },
  })

  // 初始化 IndexedDB 默认数据
  await initData()

  // 创建并挂载 Vue 应用
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  app.mount('#app')
}

// 启动应用
startApp().catch((error) => {
  console.error('应用启动失败:', error)
})
