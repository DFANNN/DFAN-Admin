import '@/styles/common.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import 'animate.css'
import { APP_CONFIG } from '@/config/app.config'
import { loadingFadeOut } from 'virtual:app-loading'
import { worker } from '@/mocks/browser'
import { initData } from '@/mocks/db/initData'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

//  设置 favicon和title
const initAppConfig = () => {
  document.title = APP_CONFIG.name

  let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement
  if (!faviconLink) {
    faviconLink = document.createElement('link')
    faviconLink.rel = 'icon'
    document.head.appendChild(faviconLink)
  }
  faviconLink.href = APP_CONFIG.faviconSrc
}

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
  initAppConfig()

  // 等待路由完全准备好（包括动态路由加载）
  await router.isReady()

  // 再等待一个 tick，确保首次路由导航完成
  await nextTick()

  // 此时路由已完全加载，可以安全地隐藏 loading
  loadingFadeOut()
}

// 启动应用
startApp().catch((error) => {
  console.error('应用启动失败:', error)
})
