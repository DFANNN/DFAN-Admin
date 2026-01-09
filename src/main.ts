import '@/styles/index.css' // 公共样式
import 'element-plus/theme-chalk/dark/css-vars.css' // Element Plus 深色模式样式
import 'element-plus/dist/index.css' // Element Plus 样式
import 'nprogress/nprogress.css' // NProgress 样式
import { APP_CONFIG } from '@/config/app.config' // 全局应用配置
import { loadingFadeOut } from 'virtual:app-loading' // 全局loading
import { worker } from '@/mocks/browser' // 模拟数据
import { initData } from '@/mocks/db/initData' // indexedDB数据库初始化数据
import { permissionDirective } from '@/directives/permission' // 自定义权限指令
import { MotionPlugin } from '@vueuse/motion' // Motion 动画插件
import VXETablePlugin from '@/plugins/vxeTable' // VXE Table 插件
import '@/plugins/echarts' // ECharts 插件
import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router/index'

//  动态设置favicon和项目名称
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

// 启动 MSW 并初始化 IndexedDB 数据
const startMocksIfEnabled = async () => {
  if (!APP_CONFIG.enableMSW) return

  // 启动 MSW worker
  await worker.start({
    // 指定 Service Worker 的 URL，考虑 base path
    serviceWorker: {
      url: `${import.meta.env.VITE_STATIC_URL}mockServiceWorker.js`,
    },
    // 只匹配 MSW 监听的请求路径，其他请求直接放行
    onUnhandledRequest(req, print) {
      if (req.url.includes(APP_CONFIG.listenMSWPath)) {
        print.warning()
      }
    },
  })

  // 初始化 IndexedDB 默认数据
  await initData()
}

// 启动应用
const startApp = async () => {
  await startMocksIfEnabled()

  // 创建并挂载 Vue 应用
  const app = createApp(App)

  // 注册 VXE Table 插件
  VXETablePlugin(app)

  app.use(createPinia())
  app.use(router)

  // 注册 Motion 动画插件
  app.use(MotionPlugin)

  // 注册自定义指令
  app.directive('permission', permissionDirective)

  app.mount('#app')
  // 动态设置favicon和项目名称
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
